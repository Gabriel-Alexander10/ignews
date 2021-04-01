import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req }); // metodo que retorna a sessão do usuário a partir dos cokies que estão enssa requisição

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, // quem esta comprando o produto -> extremamente importante!
      payment_method_types: ["card"], // método mais comum para assinaturas
      billing_address_collection: "required", // se quer obrigar o usuário a preencher o endereço
      line_items: [
        {
          price: "price_1IZPdgG4AoMZ9nkhPP6RaYIu",
          quantity: 1,
        },
      ], // quais itens a pessoa vai ter dentro do carrinho
      mode: "subscription", // tipo do produto
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL, // para onde redirecionar o usuário se a compra for um sucesso
      cancel_url: process.env.STRIPE_CANCEL_URL, // para onde redirecionar o usuário se a compra falhar
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
