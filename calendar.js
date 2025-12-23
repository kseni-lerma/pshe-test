// Производственный календарь на 2025 год для России
const productionCalendar = {
    year: 2025,
    months: [
        { number: '01', name: 'Январь', workingDays: 17, totalDays: 31 },
        { number: '02', name: 'Февраль', workingDays: 19, totalDays: 28 },
        { number: '03', name: 'Март', workingDays: 20, totalDays: 31 },
        { number: '04', name: 'Апрель', workingDays: 22, totalDays: 30 },
        { number: '05', name: 'Май', workingDays: 18, totalDays: 31 },
        { number: '06', name: 'Июнь', workingDays: 21, totalDays: 30 },
        { number: '07', name: 'Июль', workingDays: 23, totalDays: 31 },
        { number: '08', name: 'Август', workingDays: 21, totalDays: 31 },
        { number: '09', name: 'Сентябрь', workingDays: 22, totalDays: 30 },
        { number: '10', name: 'Октябрь', workingDays: 23, totalDays: 31 },
        { number: '11', name: 'Ноябрь', workingDays: 18, totalDays: 30 },
        { number: '12', name: 'Декабрь', workingDays: 22, totalDays: 31 }
    ],
    
    // Метод для получения информации о месяце
    getMonthInfo(monthNumber) {
        return this.months.find(m => m.number === monthNumber);
    },
    
    // Метод для получения количества рабочих дней в месяце
    getWorkingDays(monthNumber) {
        const month = this.getMonthInfo(monthNumber);
        return month ? month.workingDays : 21; // По умолчанию 21 день
    },
    
    // Метод для расчета доступных дней с учетом отпуска
    calculateAvailableDays(workingDays, absenceStart, absenceEnd, absenceType) {
        // Упрощенный расчет: вычитаем все дни отсутствия
        // В реальной системе нужно учитывать только рабочие дни
        if (!absenceStart || !absenceEnd) {
            return workingDays;
        }
        
        const start = new Date(absenceStart);
        const end = new Date(absenceEnd);
        const daysAbsent = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        
        // Для больничных можно вернуть больше дней
        if (absenceType === 'Больничный') {
            return Math.max(0, workingDays - Math.round(daysAbsent * 0.7));
        }
        
        return Math.max(0, workingDays - daysAbsent);
    }
};