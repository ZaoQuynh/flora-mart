export enum MailEnum {
  REGISTER_OTP = 'REGISTER_OTP',
  UPDATE_INFO_OTP = 'UPDATE_INFO_OTP',
  FORGET_PASSWORD_OTP = 'FORGET_PASSWORD_OTP',
}

class MailService {
  getEmailContent(type: MailEnum, otp: string): { subject: string; body: string } {
    switch (type) {
      case MailEnum.REGISTER_OTP:
        return {
          subject: 'Welcome to FloraMart! Here is your OTP',
          body: `Thank you for registering with FloraMart. Your OTP is: ${otp}. Please use this code to complete your registration.`,
        };
      case MailEnum.UPDATE_INFO_OTP:
        return {
          subject: 'FloraMart: OTP for Updating Your Information',
          body: `You requested to update your information on FloraMart. Your OTP is: ${otp}. Please use this code to proceed.`,
        };
      case MailEnum.FORGET_PASSWORD_OTP:
        return {
          subject: 'FloraMart: Reset Your Password',
          body: `You requested to reset your password on FloraMart. Your OTP is: ${otp}. Please use this code to complete the process.`,
        };
      default:
        throw new Error('Unknown email type');
    }
  }
}

export default MailService;
