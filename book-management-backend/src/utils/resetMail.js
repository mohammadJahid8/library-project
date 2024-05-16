import nodemailer from 'nodemailer';

export const resetMail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Reachoutpro.ai@gmail.com',
      pass: 'nksguyptztdywcti',
    },
  });

  const mailOptions = {
    from: 'Reachoutpro.ai@gmail.com',
    to: email,
    subject: `Reset your password`,
    text: `Please reset your password from the link below: https://abdi-library.vercel.app/reset-password/${link}`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.log('Something went wrong while sending mail', error);
  }
};
