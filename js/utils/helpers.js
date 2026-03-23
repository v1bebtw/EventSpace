export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const showError = (element, message) => {
    clearErrors(element);
    element.style.borderColor = 'red';
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.textContent = message;
    element.parentNode.appendChild(errorElement);
};

export const clearErrors = (element) => {
    element.style.borderColor = '';
    const errorElement = element.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
};