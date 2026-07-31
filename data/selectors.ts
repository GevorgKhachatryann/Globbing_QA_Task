export const RegistrationSelectors = {
  stepOne: {
    emailInput: 'input[placeholder="Էլ. հասցե*"]',
    passwordInput: 'input[placeholder="Գաղտնաբառ*"]',
    passwordConfirmInput: 'input[placeholder="Կրկնել գաղտնաբառը*"]',
    phoneNumberInput: 'input[placeholder="Հեռախոսահամար"]',
    submitButton: 'button:has-text("Գրանցվել")',
    termsCheckbox: '#registration-form > div.form-checkbox.form-checkbox__accept.form-box > label',
    recaptchaFrame: 'iframe[title*="reCAPTCHA" i], iframe[src*="recaptcha"]',
    errorMessageEmailInput: '#registration-form > div:nth-child(2) > p',
    errorMessagePasswords: '#registration-form > div:nth-child(3) > p'
  },
  stepTwo: {
    physicalPersonOption: 'text=/physical person/i',
    legalPersonOption: 'text=/legal person/i',
    firstNameInput: '#registration-step-two-form > div:nth-child(2) > input',
    lastNameInput: '#registration-step-two-form > div:nth-child(3) > input',
    serviceCenterSelect: '#registration-step-two-form > div:nth-child(15) > div:nth-child(1) > div:nth-child(2) > div > div > label',
    submitButton: '#registration-step-two-form > div:nth-child(17) > button',
    confirmDialogSubmitButton: 'div.form-box.mb--none.tc > button'
  },
};

