// Основное приложение ПШЭ Трекер
class PsheTracker {
    constructor() {
        this.init();
    }

    async init() {
        console.log('Инициализация ПШЭ Трекера...');
        
        // Инициализация данных
        await this.loadData();
        
        // Инициализация интерфейса
        this.initNavigation();
        this.initCalendar();
        this.initDistributionTable();
        this.initEventListeners();
        this.initTabs();
        
        // Загрузка начальных данных
        this.loadInitialData();
        
        console.log('ПШЭ Трекер готов к работе');
        this.showStatus('Система загружена. Готов к работе.');
    }

    async loadData() {
        // Загрузка данных из LocalStorage или использование начальных данных
        this.employees = this.loadFromStorage('employees') || initialData.employees;
        this.absences = this.loadFromStorage('absences') || initialData.absences;
        this.businessProcesses = this.loadFromStorage('businessProcesses') || initialData.businessProcesses;
        this.departmentsBP = this.loadFromStorage('departmentsBP') || initialData.departmentsBP;
        this.psheData = this.loadFromStorage('psheData') || [];
        
        // Сохранение в LocalStorage, если данных не было
        this.saveToStorage('employees', this.employees);
        this.saveToStorage('absences', this.absences);
        this.saveToStorage('businessProcesses', this.businessProcesses);
        this.saveToStorage('departmentsBP', this.departmentsBP);
        this.saveToStorage('psheData', this.psheData);
    }

    initNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const pages = document.querySelectorAll('.page');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const pageId = btn.dataset.page;
                
                // Обновляем активные элементы
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                pages.forEach(page => {
                    page.classList.remove('active');
                    if (page.id === `${pageId}-page`) {
                        page.classList.add('active');
                    }
                });
                
                // Обновляем содержимое страницы
                this.updatePageContent(pageId);
            });
        });
    }

    initCalendar() {
        const monthSelect = document.getElementById('month-select');
        const calendarTable = document.getElementById('calendar-table');
        
        // Заполняем выпадающий список месяцев
        productionCalendar.months.forEach(month => {
            const option = document.createElement('option');
            option.value = month.number;
            option.textContent = `${month.name} 2025 (${month.workingDays} раб. дн.)`;
            monthSelect.appendChild(option);
        });
        
        // Заполняем таблицу календаря
        const tbody = calendarTable.querySelector('tbody');
        productionCalendar.months.forEach(month => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${month.name}</td>
                <td>${month.workingDays}</td>
                <td>${month.totalDays - month.workingDays}</td>
            `;
            tbody.appendChild(row);
        });
    }

    initDistributionTable() {
        // Инициализация таблицы распределения
        const table = document.getElementById('distribution-table');
        
        // Устанавливаем заголовки БП из данных
        const bpHeaders = document.querySelectorAll('[id^="bp-header"]');
        const selectedDeptBP = this.departmentsBP['Отдел 1'] || [];
        
        selectedDeptBP.forEach((bp, index) => {
            if (bpHeaders[index]) {
                bpHeaders[index].textContent = bp;
                bpHeaders[index].dataset.bpId = bp;
            }
        });
        
        // Показываем/скрываем столбцы в зависимости от количества БП
        for (let i = 0; i < 5; i++) {
            const header = document.getElementById(`bp${i+1}-header`);
            const colIndex = 7 + i; // 7 - индекс первого столбца БП
            if (header) {
                if (i < selectedDeptBP.length) {
                    header.style.display = '';
                    // Скрываем/показываем соответствующие ячейки в теле таблицы
                } else {
                    header.style.display = 'none';
                }
            }
        }
    }

    initEventListeners() {
        // Кнопка загрузки месяца
        document.getElementById('load-month-btn').addEventListener('click', () => {
            this.loadMonthData();
        });
        
        // Кнопка сохранения распределения
        document.getElementById('save-distribution-btn').addEventListener('click', () => {
            this.saveDistribution();
        });
        
        // Кнопка копирования из прошлого месяца
        document.getElementById('copy-prev-btn').addEventListener('click', () => {
            this.copyFromPreviousMonth();
        });
        
        // Кнопки экспорта/импорта
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        
        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });
        
        // Сохранение привязки БП
        document.getElementById('save-dept-bp-btn').addEventListener('click', () => {
            this.saveDepartmentBP();
        });
        
        // Генерация отчета
        document.getElementById('generate-report-btn').addEventListener('click', () => {
            this.generateAnnualReport();
        });
        
        // Очистка данных
        document.getElementById('clear-data-btn').addEventListener('click', () => {
            if (confirm('Вы уверены? Все данные будут удалены.')) {
                this.clearAllData();
            }
        });
        
        // Сброс к начальным данным
        document.getElementById('reset-data-btn').addEventListener('click', () => {
            if (confirm('Вы уверены? Все данные будут сброшены к начальным значениям.')) {
                this.resetToInitialData();
            }
        });
        
        // Показать справку
        document.getElementById('show-help').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelp();
        });
    }

    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Обновляем активные вкладки
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    loadMonthData() {
        const department = document.getElementById('department-select').value;
        const monthSelect = document.getElementById('month-select');
        const monthNumber = monthSelect.value;
        const monthName = monthSelect.options[monthSelect.selectedIndex].text;
        
        this.showStatus(`Загрузка данных: ${department}, ${monthName}`);
        
        // Получаем сотрудников отдела
        const departmentEmployees = this.employees.filter(emp => 
            emp.отдел === department && emp.статус === 'Активен'
        );
        
        // Получаем БП для отдела
        const departmentBP = this.departmentsBP[department] || [];
        
        // Обновляем заголовки БП в таблице
        this.updateBPHeaders(departmentBP);
        
        // Заполняем таблицу распределения
        this.fillDistributionTable(departmentEmployees, department, monthNumber, departmentBP);
        
        // Показываем отсутствия в этом месяце
        this.showMonthAbsences(monthNumber);
    }

    updateBPHeaders(bpList) {
        // Обновляем заголовки столбцов БП
        for (let i = 1; i <= 5; i++) {
            const header = document.getElementById(`bp${i}-header`);
            const totalCell = document.getElementById(`total-bp${i}`);
            
            if (i <= bpList.length) {
                const bpId = bpList[i-1];
                const bp = this.businessProcesses.find(b => b.id === bpId);
                header.textContent = bpId;
                header.title = bp ? bp.name : '';
                header.style.display = '';
                if (totalCell) totalCell.style.display = '';
            } else {
                header.style.display = 'none';
                if (totalCell) totalCell.style.display = 'none';
            }
        }
    }

    fillDistributionTable(employees, department, monthNumber, bpList) {
        const tbody = document.getElementById('distribution-body');
        tbody.innerHTML = '';
        
        // Получаем производственный календарь для месяца
        const monthData = productionCalendar.months.find(m => m.number === monthNumber);
        const workingDays = monthData ? monthData.workingDays : 21;
        
        employees.forEach((emp, index) => {
            const row = document.createElement('tr');
            
            // Получаем отсутствия сотрудника в этом месяце
            const empAbsences = this.getEmployeeAbsences(emp.id, monthNumber);
            const availableDays = this.calculateAvailableDays(emp, monthNumber, workingDays);
            
            // Получаем сохраненное распределение
            const savedDistribution = this.getSavedDistribution(emp.id, department, monthNumber);
            
            // Создаем ячейки для каждого БП
            let bpCells = '';
            let bpSum = 0;
            
            bpList.forEach((bpId, bpIndex) => {
                const savedValue = savedDistribution[bpId] || 0;
                bpSum += savedValue;
                
                bpCells += `
                    <td>
                        <input type="number" 
                               class="distribution-input" 
                               data-emp="${emp.id}" 
                               data-bp="${bpId}"
                               value="${savedValue}"
                               min="0" 
                               max="1" 
                               step="0.05"
                               onchange="psheTracker.updateDistributionSum(this)">
                    </td>
                `;
            });
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${emp.имя}</td>
                <td>${emp.id}</td>
                <td>
                    <span class="status-badge ${emp.статус === 'Активен' ? 'active' : 'inactive'}">
                        ${emp.статус}
                    </span>
                </td>
                <td>${empAbsences.length > 0 ? empAbsences.map(a => `${a.type} ${a.days} дн.`).join(', ') : 'Нет'}</td>
                <td>${workingDays}</td>
                <td>
                    <input type="number" 
                           class="distribution-input" 
                           data-emp="${emp.id}"
                           id="available-${emp.id}"
                           value="${availableDays}"
                           min="0" 
                           max="${workingDays}"
                           step="1">
                </td>
                ${bpCells}
                <td id="sum-${emp.id}">${bpSum.toFixed(2)}</td>
                <td id="check-${emp.id}">
                    <i class="fas ${Math.abs(bpSum - 1) < 0.01 ? 'fa-check-circle valid' : 'fa-times-circle invalid'}"></i>
                </td>
                <td>
                    <button class="btn btn-small" onclick="psheTracker.resetEmployeeDistribution('${emp.id}')">
                        <i class="fas fa-redo"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Обновляем итоги
        this.updateTotals();
    }

    getEmployeeAbsences(employeeId, monthNumber) {
        return this.absences.filter(abs => {
            if (abs.сотрудникId !== employeeId) return false;
            
            const startDate = new Date(abs.начало);
            const endDate = new Date(abs.конец);
            const targetMonth = parseInt(monthNumber);
            
            return (startDate.getMonth() + 1 === targetMonth || 
                   endDate.getMonth() + 1 === targetMonth ||
                   (startDate.getMonth() + 1 < targetMonth && endDate.getMonth() + 1 > targetMonth));
        });
    }

    calculateAvailableDays(employee, monthNumber, totalWorkingDays) {
        // Проверяем, уволен ли сотрудник до этого месяца
        if (employee.увольнение) {
            const fireDate = new Date(employee.увольнение);
            const fireMonth = fireDate.getMonth() + 1;
            if (fireMonth < parseInt(monthNumber)) {
                return 0;
            }
        }
        
        // Проверяем, принят ли сотрудник после начала месяца
        if (employee.прием) {
            const hireDate = new Date(employee.прием);
            const hireMonth = hireDate.getMonth() + 1;
            if (hireMonth > parseInt(monthNumber)) {
                return 0;
            } else if (hireMonth === parseInt(monthNumber)) {
                // Рассчитываем дни с даты приема
                const monthStart = new Date(2025, parseInt(monthNumber) - 1, 1);
                const daysInMonth = new Date(2025, parseInt(monthNumber), 0).getDate();
                const daysFromHire = daysInMonth - hireDate.getDate() + 1;
                
                // Нужна более сложная логика с учетом рабочих дней
                return Math.min(totalWorkingDays, Math.round(daysFromHire * totalWorkingDays / daysInMonth));
            }
        }
        
        // Учитываем отпуска и больничные
        const absences = this.getEmployeeAbsences(employee.id, monthNumber);
        let absentDays = 0;
        
        absences.forEach(abs => {
            const start = new Date(abs.начало);
            const end = new Date(abs.конец);
            const monthStart = new Date(2025, parseInt(monthNumber) - 1, 1);
            const monthEnd = new Date(2025, parseInt(monthNumber), 0);
            
            // Рассчитываем пересечение периода отсутствия с месяцем
            const absenceStart = start < monthStart ? monthStart : start;
            const absenceEnd = end > monthEnd ? monthEnd : end;
            
            // Упрощенный расчет - считаем все дни отсутствия
            const daysDiff = Math.ceil((absenceEnd - absenceStart) / (1000 * 60 * 60 * 24)) + 1;
            absentDays += daysDiff;
        });
        
        // Упрощенный расчет - вычитаем дни отсутствия
        // В реальной системе нужно учитывать только рабочие дни
        return Math.max(0, totalWorkingDays - Math.round(absentDays * totalWorkingDays / 30));
    }

    getSavedDistribution(employeeId, department, monthNumber) {
        // Ищем сохраненные данные
        const saved = this.psheData.find(data => 
            data.сотрудникId === employeeId && 
            data.отдел === department && 
            data.месяц === monthNumber
        );
        
        return saved ? saved.распределение : {};
    }

    updateDistributionSum(input) {
        const empId = input.dataset.emp;
        const bpId = input.dataset.bp;
        const value = parseFloat(input.value) || 0;
        
        // Находим все инпуты для этого сотрудника
        const empInputs = document.querySelectorAll(`.distribution-input[data-emp="${empId}"]`);
        let sum = 0;
        
        empInputs.forEach(inp => {
            if (inp.dataset.bp) {
                sum += parseFloat(inp.value) || 0;
            }
        });
        
        // Обновляем сумму
        const sumCell = document.getElementById(`sum-${empId}`);
        const checkCell = document.getElementById(`check-${empId}`);
        
        sumCell.textContent = sum.toFixed(2);
        
        // Проверяем, равна ли сумма 1.0
        const isValid = Math.abs(sum - 1) < 0.01;
        
        if (isValid) {
            checkCell.innerHTML = '<i class="fas fa-check-circle valid"></i>';
        } else {
            checkCell.innerHTML = `<i class="fas fa-times-circle invalid"></i>`;
        }
        
        // Обновляем итоги
        this.updateTotals();
    }

    updateTotals() {
        const bpList = this.getCurrentBPList();
        const totals = {};
        
        // Инициализируем нулями
        bpList.forEach(bp => {
            totals[bp] = 0;
        });
        
        // Считаем фактические ПШЭ для каждого БП
        const rows = document.querySelectorAll('#distribution-body tr');
        rows.forEach(row => {
            const empId = row.querySelector('input[data-emp]')?.dataset.emp;
            const availableInput = document.getElementById(`available-${empId}`);
            const availableDays = parseFloat(availableInput?.value) || 0;
            
            // Получаем рабочие дни в месяце
            const workingDays = parseInt(row.cells[5].textContent) || 21;
            
            bpList.forEach((bp, index) => {
                const input = row.querySelector(`input[data-bp="${bp}"]`);
                if (input) {
                    const share = parseFloat(input.value) || 0;
                    const factPSHE = share * (availableDays / workingDays);
                    totals[bp] = (totals[bp] || 0) + factPSHE;
                }
            });
        });
        
        // Обновляем ячейки с итогами
        bpList.forEach((bp, index) => {
            const totalCell = document.getElementById(`total-bp${index + 1}`);
            if (totalCell) {
                totalCell.textContent = totals[bp].toFixed(2);
                totalCell.style.display = '';
            }
        });
        
        // Общая сумма
        const totalSum = Object.values(totals).reduce((sum, val) => sum + val, 0);
        document.getElementById('total-sum').textContent = totalSum.toFixed(2);
        
        // Проверка валидации
        this.updateValidationStatus();
    }

    getCurrentBPList() {
        const department = document.getElementById('department-select').value;
        return this.departmentsBP[department] || [];
    }

    updateValidationStatus() {
        const validationStatus = document.getElementById('validation-status');
        const rows = document.querySelectorAll('#distribution-body tr');
        let allValid = true;
        
        rows.forEach(row => {
            const sumCell = row.querySelector('td[id^="sum-"]');
            if (sumCell) {
                const sum = parseFloat(sumCell.textContent);
                if (Math.abs(sum - 1) > 0.01) {
                    allValid = false;
                }
            }
        });
        
        if (allValid && rows.length > 0) {
            validationStatus.innerHTML = '<i class="fas fa-check-circle valid"></i> Все проверки пройдены';
            validationStatus.classList.remove('invalid');
            validationStatus.classList.add('valid');
        } else if (rows.length === 0) {
            validationStatus.innerHTML = '<i class="fas fa-info-circle"></i> Нет данных для отображения';
        } else {
            validationStatus.innerHTML = '<i class="fas fa-exclamation-triangle invalid"></i> Есть ошибки в распределении';
            validationStatus.classList.remove('valid');
            validationStatus.classList.add('invalid');
        }
    }

    showMonthAbsences(monthNumber) {
        const tbody = document.getElementById('absences-table').querySelector('tbody');
        tbody.innerHTML = '';
        
        const monthAbsences = this.absences.filter(abs => {
            const startDate = new Date(abs.начало);
            return (startDate.getMonth() + 1) === parseInt(monthNumber);
        });
        
        monthAbsences.forEach(abs => {
            const employee = this.employees.find(emp => emp.id === abs.сотрудникId);
            if (employee) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.имя}</td>
                    <td>${formatDate(new Date(abs.начало))} - ${formatDate(new Date(abs.конец))}</td>
                    <td>${abs.тип}</td>
                `;
                tbody.appendChild(row);
            }
        });
    }

    saveDistribution() {
        const department = document.getElementById('department-select').value;
        const monthSelect = document.getElementById('month-select');
        const monthNumber = monthSelect.value;
        
        const rows = document.querySelectorAll('#distribution-body tr');
        const bpList = this.getCurrentBPList();
        
        rows.forEach(row => {
            const empId = row.querySelector('input[data-emp]')?.dataset.emp;
            if (!empId) return;
            
            const availableInput = document.getElementById(`available-${empId}`);
            const availableDays = parseFloat(availableInput?.value) || 0;
            
            const distribution = {};
            let totalShare = 0;
            
            bpList.forEach(bp => {
                const input = row.querySelector(`input[data-bp="${bp}"]`);
                if (input) {
                    const value = parseFloat(input.value) || 0;
                    distribution[bp] = value;
                    totalShare += value;
                }
            });
            
            // Проверяем сумму распределения
            if (Math.abs(totalShare - 1) > 0.01) {
                alert(`Ошибка у сотрудника ${empId}: сумма распределения ${totalShare.toFixed(2)} не равна 1.0`);
                return;
            }
            
            // Сохраняем данные
            this.savePSHEData(empId, department, monthNumber, distribution, availableDays);
        });
        
        this.showStatus('Распределение успешно сохранено');
        alert('Данные успешно сохранены!');
    }

    savePSHEData(employeeId, department, monthNumber, distribution, availableDays) {
        // Ищем существующую запись
        const existingIndex = this.psheData.findIndex(data => 
            data.сотрудникId === employeeId && 
            data.отдел === department && 
            data.месяц === monthNumber
        );
        
        const data = {
            сотрудникId: employeeId,
            отдел: department,
            месяц: monthNumber,
            распределение: distribution,
            доступноДней: availableDays,
            датаСохранения: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            this.psheData[existingIndex] = data;
        } else {
            this.psheData.push(data);
        }
        
        this.saveToStorage('psheData', this.psheData);
    }

    copyFromPreviousMonth() {
        const currentMonth = document.getElementById('month-select').value;
        const prevMonth = (parseInt(currentMonth) - 1) || 12;
        
        if (confirm(`Скопировать распределение из ${prevMonth} месяца?`)) {
            // Логика копирования
            this.showStatus(`Копирование из ${prevMonth} месяца...`);
            // В реальной системе здесь будет код копирования данных
            alert('Функция копирования находится в разработке');
        }
    }

    exportData() {
        const allData = {
            employees: this.employees,
            absences: this.absences,
            businessProcesses: this.businessProcesses,
            departmentsBP: this.departmentsBP,
            psheData: this.psheData,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(allData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `pshe_data_${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showStatus('Данные экспортированы в JSON файл');
    }

    async importData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Проверяем структуру данных
                if (importedData.employees && importedData.psheData) {
                    if (confirm('Заменить текущие данные импортированными?')) {
                        this.employees = importedData.employees;
                        this.absences = importedData.absences;
                        this.businessProcesses = importedData.businessProcesses;
                        this.departmentsBP = importedData.departmentsBP;
                        this.psheData = importedData.psheData;
                        
                        this.saveAllToStorage();
                        this.showStatus('Данные успешно импортированы');
                        alert('Данные импортированы! Обновите страницу.');
                    }
                } else {
                    alert('Неверный формат файла');
                }
            } catch (error) {
                alert('Ошибка при чтении файла: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    }

    saveDepartmentBP() {
        const department = document.getElementById('dept-bp-select').value;
        const checkboxes = document.querySelectorAll('.bp-item input:checked');
        const selectedBP = Array.from(checkboxes).map(cb => cb.value);
        
        this.departmentsBP[department] = selectedBP;
        this.saveToStorage('departmentsBP', this.departmentsBP);
        
        this.showStatus(`Привязка БП для ${department} сохранена`);
        alert('Привязка сохранена!');
    }

    generateAnnualReport() {
        const department = document.getElementById('report-dept-select').value;
        const bpList = this.departmentsBP[department] || [];
        
        // Инициализируем данные для отчета
        const reportData = {};
        bpList.forEach(bp => {
            reportData[bp] = Array(12).fill(0);
        });
        
        // Агрегируем данные за год
        this.psheData.forEach(data => {
            if (data.отдел === department && data.месяц) {
                const monthIndex = parseInt(data.месяц) - 1;
                Object.entries(data.распределение).forEach(([bp, share]) => {
                    if (reportData[bp]) {
                        // Рассчитываем фактические ПШЭ
                        const workingDays = productionCalendar.months[monthIndex]?.workingDays || 21;
                        const factPSHE = share * (data.доступноДней / workingDays);
                        reportData[bp][monthIndex] += factPSHE;
                    }
                });
            }
        });
        
        // Заполняем таблицу отчета
        this.fillAnnualReportTable(reportData, bpList);
        
        // Строим график
        this.renderAnnualChart(reportData, bpList);
    }

    fillAnnualReportTable(reportData, bpList) {
        const tbody = document.querySelector('#annual-report-table tbody');
        tbody.innerHTML = '';
        
        bpList.forEach(bpId => {
            const bp = this.businessProcesses.find(b => b.id === bpId);
            const rowData = reportData[bpId];
            const total = rowData.reduce((sum, val) => sum + val, 0);
            
            const row = document.createElement('tr');
            let cells = `<td><strong>${bpId}</strong> - ${bp ? bp.name : ''}</td>`;
            
            rowData.forEach((value, index) => {
                cells += `<td>${value.toFixed(2)}</td>`;
            });
            
            cells += `<td><strong>${total.toFixed(2)}</strong></td>`;
            row.innerHTML = cells;
            tbody.appendChild(row);
        });
        
        // Добавляем строку итогов
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        let totalCells = '<td><strong>ВСЕГО по отделу</strong></td>';
        let monthlyTotals = Array(12).fill(0);
        
        bpList.forEach(bpId => {
            reportData[bpId].forEach((value, index) => {
                monthlyTotals[index] += value;
            });
        });
        
        monthlyTotals.forEach(total => {
            totalCells += `<td><strong>${total.toFixed(2)}</strong></td>`;
        });
        
        const grandTotal = monthlyTotals.reduce((sum, val) => sum + val, 0);
        totalCells += `<td><strong>${grandTotal.toFixed(2)}</strong></td>`;
        
        totalRow.innerHTML = totalCells;
        tbody.appendChild(totalRow);
    }

    renderAnnualChart(reportData, bpList) {
        const ctx = document.getElementById('annual-chart').getContext('2d');
        
        // Подготавливаем данные для Chart.js
        const labels = productionCalendar.months.map(m => m.name);
        const datasets = bpList.map((bpId, index) => {
            const bp = this.businessProcesses.find(b => b.id === bpId);
            const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'];
            
            return {
                label: bp ? bp.name : bpId,
                data: reportData[bpId],
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                borderWidth: 2,
                fill: true
            };
        });
        
        // Уничтожаем предыдущий график, если он существует
        if (window.annualChart) {
            window.annualChart.destroy();
        }
        
        window.annualChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Нагрузка по бизнес-процессам в 2025 году'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'ПШЭ'
                        }
                    }
                }
            }
        });
    }

    resetEmployeeDistribution(employeeId) {
        if (confirm('Сбросить распределение для этого сотрудника?')) {
            // Находим все инпуты для сотрудника и сбрасываем их
            const inputs = document.querySelectorAll(`.distribution-input[data-emp="${employeeId}"]`);
            inputs.forEach(input => {
                if (input.dataset.bp) {
                    input.value = '0';
                }
            });
            
            // Равномерно распределяем
            const bpInputs = document.querySelectorAll(`.distribution-input[data-emp="${employeeId}"][data-bp]`);
            const equalShare = (1 / bpInputs.length).toFixed(2);
            
            bpInputs.forEach(input => {
                input.value = equalShare;
            });
            
            // Обновляем сумму
            this.updateDistributionSum(bpInputs[0]);
        }
    }

    clearAllData() {
        localStorage.clear();
        this.employees = [];
        this.absences = [];
        this.businessProcesses = [];
        this.departmentsBP = {};
        this.psheData = [];
        
        this.showStatus('Все данные очищены');
        alert('Все данные очищены. Страница будет перезагружена.');
        location.reload();
    }

    resetToInitialData() {
        this.employees = initialData.employees;
        this.absences = initialData.absences;
        this.businessProcesses = initialData.businessProcesses;
        this.departmentsBP = initialData.departmentsBP;
        this.psheData = [];
        
        this.saveAllToStorage();
        this.showStatus('Данные сброшены к начальным значениям');
        alert('Данные сброшены! Страница будет перезагружена.');
        location.reload();
    }

    showHelp() {
        const modal = document.getElementById('help-modal');
        modal.style.display = 'flex';
        
        const closeBtns = document.querySelectorAll('.close-modal');
        closeBtns.forEach(btn => {
            btn.onclick = () => {
                modal.style.display = 'none';
            };
        });
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    updatePageContent(pageId) {
        switch(pageId) {
            case 'data':
                this.loadDataPage();
                break;
            case 'report':
                this.generateAnnualReport();
                break;
        }
    }

    loadDataPage() {
        // Заполняем список БП для выбора
        const bpList = document.getElementById('bp-list');
        bpList.innerHTML = '';
        
        const department = document.getElementById('dept-bp-select').value;
        const selectedBP = this.departmentsBP[department] || [];
        
        this.businessProcesses.forEach(bp => {
            const isChecked = selectedBP.includes(bp.id);
            const div = document.createElement('div');
            div.className = 'bp-item';
            div.innerHTML = `
                <input type="checkbox" id="bp-${bp.id}" value="${bp.id}" ${isChecked ? 'checked' : ''}>
                <label for="bp-${bp.id}">
                    <strong>${bp.id}</strong> - ${bp.name}
                </label>
            `;
            bpList.appendChild(div);
        });
    }

    saveAllToStorage() {
        this.saveToStorage('employees', this.employees);
        this.saveToStorage('absences', this.absences);
        this.saveToStorage('businessProcesses', this.businessProcesses);
        this.saveToStorage('departmentsBP', this.departmentsBP);
        this.saveToStorage('psheData', this.psheData);
    }

    saveToStorage(key, data) {
        localStorage.setItem(`pshe_${key}`, JSON.stringify(data));
    }

    loadFromStorage(key) {
        const data = localStorage.getItem(`pshe_${key}`);
        return data ? JSON.parse(data) : null;
    }

    showStatus(message) {
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
        
        // Автоматически очищаем через 5 секунд
        setTimeout(() => {
            if (statusElement.textContent === message) {
                statusElement.textContent = 'Готов к работе';
            }
        }, 5000);
    }

    loadInitialData() {
        // Загружаем первый месяц по умолчанию
        setTimeout(() => {
            this.loadMonthData();
        }, 100);
    }
}

// Вспомогательные функции
function formatDate(date) {
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Инициализация приложения
let psheTracker;

document.addEventListener('DOMContentLoaded', () => {
    psheTracker = new PsheTracker();
    window.psheTracker = psheTracker; // Делаем глобальным для вызовов из HTML
});