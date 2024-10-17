document.addEventListener('DOMContentLoaded', function() {
    const csvFilePath = 'data.csv';  // Путь к CSV файлу

    Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: function(results) {
            const tableBody = document.querySelector('#productTable tbody');
            
            results.data.forEach(row => {
                const tr = document.createElement('tr');
                
                // Добавляем название товара
                const nameTd = document.createElement('td');
                nameTd.textContent = row['Наименование товара'];
                tr.appendChild(nameTd);
                
                // Добавляем классификацию товара
                const classificationTd = document.createElement('td');
                classificationTd.textContent = row['Классификация товара'];
                tr.appendChild(classificationTd);

                // Добавляем категорию
                const categoryTd = document.createElement('td');
                categoryTd.textContent = row['Категория'];
                tr.appendChild(categoryTd);

                // Добавляем единицу измерения
                const unitTd = document.createElement('td');
                unitTd.textContent = row['Единица измерения'];
                tr.appendChild(unitTd);

                // Поле для ввода стоимости
                const costInputTd = document.createElement('td');
                const costInput = document.createElement('input');
                costInput.type = 'number';
                costInput.min = '0'; // Минимальное значение 0
                costInput.value = row['Стоимость'] || 0;  // Исправлено на 'Стоимость'
                costInputTd.appendChild(costInput);
                tr.appendChild(costInputTd);

                // Поле для ввода наценки
                const markupInputTd = document.createElement('td');
                const markupInput = document.createElement('input');
                markupInput.type = 'number';
                markupInput.min = '0'; // Минимальное значение 0
                markupInput.value = row['Наценка'] || 0;  // Исправлено на 'Наценка'
                markupInputTd.appendChild(markupInput);
                tr.appendChild(markupInputTd);

                // Поле для отображения стоимости с наценкой
                const finalPriceTd = document.createElement('td');
                const finalPrice = document.createElement('span');
                finalPrice.textContent = calculateFinalPrice(costInput.value, markupInput.value);
                finalPriceTd.appendChild(finalPrice);
                tr.appendChild(finalPriceTd);

                // Добавляем обработчики для пересчета стоимости
                costInput.addEventListener('input', function() {
                    validateInput(costInput);
                    finalPrice.textContent = calculateFinalPrice(costInput.value, markupInput.value);
                });
                
                markupInput.addEventListener('input', function() {
                    validateInput(markupInput);
                    finalPrice.textContent = calculateFinalPrice(costInput.value, markupInput.value);
                });

                tableBody.appendChild(tr);
            });
        }
    });

    // Функция для расчета стоимости с наценкой
    function calculateFinalPrice(cost, markup) {
        const costValue = parseFloat(cost);
        const markupValue = parseFloat(markup);
        if (isNaN(costValue) || isNaN(markupValue)) {
            return '0'; // Возвращаем 0, если данные некорректны
        }
        return (costValue + (costValue * (markupValue / 100))).toFixed(2);
    }

    // Функция для проверки, что введенное значение не отрицательное
    function validateInput(input) {
        if (input.value < 0) {
            input.value = 0;  // Если значение меньше нуля, ставим 0
        }
    }

    // Функция для скачивания CSV файла
    document.getElementById('downloadCsv').addEventListener('click', function() {
        const rows = [];
        const headers = ['Наименование товара', 'Классификация товара', 'Категория', 'Единица измерения', 'Стоимость', 'Наценка', 'Стоимость с наценкой'];
        rows.push(headers);

        // Собираем данные из таблицы
        document.querySelectorAll('#productTable tbody tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach((cell, index) => {
                if (index === 4 || index === 5) {  // Стоимость и Наценка
                    rowData.push(cell.querySelector('input').value);
                } else if (index === 6) {  // Стоимость с наценкой
                    rowData.push(cell.querySelector('span').textContent);
                } else {
                    rowData.push(cell.textContent);
                }
            });
            rows.push(rowData);
        });

        // Преобразуем данные в CSV строку, убираем лишние запятые
        let csvContent = 'data:text/csv;charset=utf-8,';
        rows.forEach(rowArray => {
            // Убираем лишнюю запятую, которая может появляться в конце
            let row = rowArray.join(',').replace(/,+$/, '');  
            csvContent += row + '\r\n';
        });

        // Создаем ссылку для скачивания CSV файла
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);  // Удаляем ссылку после скачивания
    });
});
