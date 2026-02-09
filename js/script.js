console.log('Скрипт проекта EventSpace загружен!');

function showWelcomeMessage() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;
    
    if (hours < 12) greeting = "Доброе утро!";
    else if (hours < 18) greeting = "Добрый день!";
    else greeting = "Добрый вечер!";
    
    console.log('${greeting} Добро пожаловать в EventSpace!');
}

showWelcomeMessage();