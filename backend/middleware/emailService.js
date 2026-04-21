const { transporter } = require('./emailConfig');
const {
  verificationEmailTemplate,
  welcomeEmailTemplate,
  satelliteAlertEmailTemplate,
  subscriptionEmailTemplate,
  specialistContactEmailTemplate,
} = require('./emailTemplates');

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: `"HealthCompass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Email - HealthCompass',
      text: 'Verify your Email - HealthCompass',
      html: verificationEmailTemplate(verificationCode),
    });
    console.log('Verification email sent successfully:', response.messageId);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.log('Email error:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: `"HealthCompass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to HealthCompass!',
      text: 'Welcome to HealthCompass!',
      html: welcomeEmailTemplate(name),
    });
    console.log('Welcome email sent successfully:', response.messageId);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.log('Email error:', error);
    return { success: false, error: error.message };
  }
};

const sendBroadcastEmail = async (email, name, subject, message) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: white; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HealthCompass</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <div style="white-space: pre-wrap;">${message}</div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} HealthCompass. All rights reserved.</p>
            <p>This is an automated message from HealthCompass Admin.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await transporter.sendMail({
      from: `"HealthCompass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
      html: html,
    });
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.log('Broadcast email error:', error);
    return { success: false, error: error.message };
  }
};

const sendSatelliteAlertEmail = async (email, payload) => {
  try {
    const subject = payload?.subject || 'HealthCompass Field Alert';
    const html = satelliteAlertEmailTemplate(payload);
    const response = await transporter.sendMail({
      from: `"HealthCompass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: payload?.summary || 'Field alert generated.',
      html,
    });
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.log('Satellite alert email error:', error);
    return { success: false, error: error.message };
  }
};

const sendSubscriptionEmail = async (email, name, plan) => {
  try {
    const response = await transporter.sendMail({
      from: `"HealthCompass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Subscription Upgraded to ${plan.toUpperCase()}`,
      text: `Hello ${name}, your subscription has been upgraded to ${plan.toUpperCase()}.`,
      html: subscriptionEmailTemplate(name, plan),
    });
    console.log('Subscription email sent successfully:', response.messageId);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.log('Email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendBroadcastEmail,
  sendSatelliteAlertEmail,
  sendSubscriptionEmail,
  sendSpecialistContactEmail: async (patientName, caregiverEmail, message) => {
    try {
      const response = await transporter.sendMail({
        from: `"HealthCompass Specialist Support" <${process.env.EMAIL_USER}>`,
        to: "hammadxflow66@gmail.com", // Updated specialist recipient
        replyTo: caregiverEmail, // Specialist can reply directly to caregiver
        subject: `[Specialist Request] Patient: ${patientName}`,
        text: `New specialist contact request for patient ${patientName} from ${caregiverEmail}. Message: ${message}`,
        html: specialistContactEmailTemplate(patientName, caregiverEmail, message),
      });
      console.log('Specialist contact email sent successfully:', response.messageId);
      return { success: true, messageId: response.messageId };
    } catch (error) {
      console.log('Specialist email error:', error);
      return { success: false, error: error.message };
    }
  },
};
