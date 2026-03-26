import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session;
    const { userId, credits } = session.metadata ?? {};

    try {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: parseInt(credits) } },
        }),
        prisma.purchase.update({
          where: { stripeSessionId: session.id },
          data: { status: 'COMPLETED' },
        }),
      ]);
    } catch (error) {
      console.error('Webhook processing error:', error);
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
