export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Přijímá +420 nebo +421 na začátku
  const phoneRegex = /^\+?(420|421)\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateForm = (formData) => {
  const errors = {};

  if (!formData.jmeno || formData.jmeno.trim() === '') {
    errors.jmeno = 'Jméno je povinné';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Zadejte platný email';
  }

  if (!validatePhone(formData.telefon)) {
    errors.telefon = 'Telefon musí být ve formátu +420 nebo +421';
  }

  if (!formData.datum) {
    errors.datum = 'Datum je povinné';
  }

  if (!formData.cas) {
    errors.cas = 'Čas je povinný';
  }

  if (!formData.akce) {
    errors.akce = 'Vyberte typ akce';
  }

  if (!formData.pocet_osob || formData.pocet_osob < 1) {
    errors.pocet_osob = 'Počet osob musí být alespoň 1';
  }

  return errors;
};
