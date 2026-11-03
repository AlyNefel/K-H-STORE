import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EmailLog } from './models/index.ts';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  type: string;
}

export async function sendEmail({ to, subject, html, type }: EmailPayload) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials missing. Email simulated for:', to);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: `"K&H Online Store" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✉️ Email [${type}] sent to ${to}: ${info.messageId}`);
    try {
      await EmailLog.create({
        to,
        subject,
        type,
        status: 'sent'
      });
    } catch {
      // non-blocking
    }
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Failed to send email [${type}] to ${to}:`, error.message);
    try {
      await EmailLog.create({
        to,
        subject,
        type,
        status: 'failed',
        error: error.message
      });
    } catch {
      // non-blocking
    }
    return { success: false, error: error.message };
  }
}

// Order confirmation email template
export async function sendOrderConfirmationEmail(order: any) {
  const itemsHtml = order.items.map((item: any) => `
    <tr style="border-bottom: 1px solid #F5E7E5;">
      <td style="padding: 12px; font-family: sans-serif; font-size: 14px; color: #292626;">
        <strong>${item.titleAr || item.title}</strong>
        ${item.variant?.size ? `<br><span style="font-size: 12px; color: #777;">المقاس: ${item.variant.size}</span>` : ''}
        ${item.variant?.color ? `<span style="font-size: 12px; color: #777; margin-right: 8px;">اللون: ${item.variant.color}</span>` : ''}
      </td>
      <td style="padding: 12px; text-align: center; font-size: 14px; color: #292626;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right; font-size: 14px; color: #292626; font-weight: bold;">${(item.price * item.quantity).toFixed(2)} د.ت</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <title>تأكيد طلبك من متجر K&H</title>
    </head>
    <body style="background-color: #FFF9F5; margin: 0; padding: 30px; font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #F5E7E5; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
        <!-- Header -->
        <div style="background-color: #292626; padding: 28px; text-align: center; border-bottom: 3px solid #C5A477;">
          <h1 style="color: #C5A477; margin: 0; font-size: 28px; letter-spacing: 2px;">K&H ONLINE STORE</h1>
          <p style="color: #F5E7E5; margin: 6px 0 0 0; font-size: 14px;">كل ما يهم المرأة و المنزل</p>
        </div>

        <!-- Greeting -->
        <div style="padding: 30px;">
          <h2 style="color: #B77D83; margin-top: 0; font-size: 20px;">شكراً لطلبكِ، ${order.customerDetails.fullName}!</h2>
          <p style="color: #555; line-height: 1.6; font-size: 15px;">
            يسعدنا إعلامكِ بأننا قد استلمنا طلبكِ بنجاح برقم: <strong style="color: #292626;">#${order.orderNumber}</strong>.
            يقوم فريقنا حالياً بتجهيز الطلب بكل عناية لشحنه إليكِ في أقرب وقت.
          </p>

          <!-- Order Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: #FFF9F5; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #F5E7E5; color: #292626; text-align: right;">
                <th style="padding: 12px; font-size: 13px;">المنتج</th>
                <th style="padding: 12px; text-align: center; font-size: 13px;">الكمية</th>
                <th style="padding: 12px; text-align: right; font-size: 13px;">المجموع</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px 12px; text-align: right; color: #666; font-size: 14px;">المجموع الفرعي:</td>
                <td style="padding: 10px 12px; text-align: right; font-weight: bold; color: #292626;">${order.subtotal.toFixed(2)} د.ت</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td colspan="2" style="padding: 8px 12px; text-align: right; color: #B77D83; font-size: 14px;">الخصم:</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #B77D83;">-${order.discount.toFixed(2)} د.ت</td>
              </tr>` : ''}
              <tr>
                <td colspan="2" style="padding: 8px 12px; text-align: right; color: #666; font-size: 14px;">رسوم التوصيل:</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #292626;">${order.deliveryFee === 0 ? 'مجاني' : `${order.deliveryFee.toFixed(2)} د.ت`}</td>
              </tr>
              <tr style="border-top: 2px solid #C5A477; background: #FFF9F5;">
                <td colspan="2" style="padding: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #292626;">المجموع النهائي (عند الاستلام):</td>
                <td style="padding: 12px; text-align: right; font-size: 18px; font-weight: bold; color: #B77D83;">${order.total.toFixed(2)} د.ت</td>
              </tr>
            </tfoot>
          </table>

          <!-- Shipping Details -->
          <div style="background: #FDF7F6; border: 1px solid #F5E7E5; border-radius: 8px; padding: 18px; margin-top: 20px;">
            <h3 style="color: #292626; margin: 0 0 10px 0; font-size: 15px;">عنوان الشحن والتوصيل:</h3>
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>الاسم:</strong> ${order.customerDetails.fullName}</p>
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>الهاتف:</strong> ${order.customerDetails.phone}</p>
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>الولاية / المدينة:</strong> ${order.customerDetails.governorate}، ${order.customerDetails.city}</p>
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>العنوان:</strong> ${order.customerDetails.address}</p>
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>طريقة الدفع:</strong> الدفع عند الاستلام (Paiement à la livraison)</p>
          </div>

          <p style="color: #777; font-size: 13px; text-align: center; margin-top: 30px;">
            لأي استفسار أو تعديل على طلبكِ، يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف: +216 55 123 456.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #292626; color: #999; padding: 16px; text-align: center; font-size: 12px;">
          © ${new Date().getFullYear()} K&H Online Store. جميع الحقوق محفوظة.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: order.customerDetails.email,
    subject: `تأكيد استلام طلبك #${order.orderNumber} - متجر K&H`,
    html,
    type: 'order_confirmation'
  });
}

// Order status change notification
export async function sendOrderStatusUpdateEmail(order: any, newStatus: string) {
  const statusTranslations: Record<string, { ar: string; fr: string }> = {
    confirmed: { ar: 'تم تأكيد طلبك', fr: 'Commande confirmée' },
    processing: { ar: 'قيد التجهيز والتغليف', fr: 'En cours de préparation' },
    shipped: { ar: 'تم شحن طلبك مع الموزع', fr: 'Commande expédiée' },
    delivered: { ar: 'تم تسليم طلبك بنجاح', fr: 'Commande livrée' },
    cancelled: { ar: 'تم إلغاء الطلب', fr: 'Commande annulée' }
  };

  const statusInfo = statusTranslations[newStatus] || { ar: newStatus, fr: newStatus };

  const html = `
    <div dir="rtl" style="font-family: sans-serif; background: #FFF9F5; padding: 24px; color: #292626;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; border: 1px solid #F5E7E5; border-radius: 10px; padding: 24px;">
        <h2 style="color: #B77D83; margin-top: 0;">تحديث حالة طلبك #${order.orderNumber}</h2>
        <p>مرحباً ${order.customerDetails.fullName}،</p>
        <p>نود إعلامكِ بأن حالة طلبكِ أصبحت الآن: <strong style="color: #292626; background: #F5E7E5; padding: 4px 10px; border-radius: 4px;">${statusInfo.ar}</strong> (${statusInfo.fr})</p>
        <p>المبلغ الإجمالي: <strong>${order.total.toFixed(2)} د.ت</strong></p>
        <hr style="border: none; border-top: 1px solid #F5E7E5; margin: 20px 0;">
        <p style="font-size: 13px; color: #777;">متجر K&H - كل ما يهم المرأة و المنزل</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: order.customerDetails.email,
    subject: `تحديث طلبك #${order.orderNumber}: ${statusInfo.ar} - K&H`,
    html,
    type: 'order_status_update'
  });
}
