// ПШЭ Трекер - Основное приложение
class PsheTracker {
    constructor() {
        this.data = {
            employees: [],
            absences: [],
            departmentsBP: {},
            psheData: [],
            businessProcesses: [
                { id: 'BP01', name: 'Анализ отчетности' },
                { id: 'BP02', name: 'Проведение проверок' },
                { id: 'BP03', name: 'Мониторинг рисков' },
                { id: 'BP05', name: 'Выездные проверки' },
                { id: 'BP06', name: 'Консультирование банков' }
            ]
        };
        
        this.currentUser = {
            name: 'Сидоров С.С.',
            department: 'Отдел 1',
            role: 'Руководитель отдела'
        };
        
        this.init();
    }
    
    async init() {
        console.log('Инициализация ПШЭ Трекера...');
        
        // Загрузка данных из LocalStorage
        this.loadAllData();
        
        // Если данных нет, загружаем начальные
        if (this.data.employees.length === 0) {
            this.loadInitialData();
        }
        
        // Инициализация интерфейса
        this.initNavigation();
        this.initEventListeners();
        this.initTabs();
        
        // Автоматическая загрузка начального месяца
        setTimeout(() => {
            this.loadMonthData();
            this.updateEmployeesTable();
            this.updateAbsencesTable();
            this.updatePSHEDataTable();
            this.updateBPList();
            this.updateBPsTable();
        }, 100);
        
        console.log('ПШЭ Трекер готов к работе');
        this.showStatus('Система загружена. Готов к работе.');
    }
    
    // ==================== ДАННЫЕ ====================
    
    loadInitialData() {
        // Начальные данные сотрудников
        this.data.employees = [
            { 
                id: 'EMP001', 
                name: 'Иванов Иван Иванович', 
                department: 'Отдел 1', 
                position: 'Главный специалист',
                hireDate: '2020-03-01',
                dismissalDate: '',
                status: 'Активен',
                manager: 'Петров П.П.'
            },
            { 
                id: 'EMP002', 
                name: 'Петров Петр Петрович', 
                department: 'Отдел 1', 
                position: 'Начальник отдела',
                hireDate: '2018-06-15',
                dismissalDate: '',
                status: 'Активен',
                manager: 'Сидоров С.С.'
            },
            { 
                id: 'EMP003', 
                name: 'Сидорова Мария Константиновна', 
                department: 'Отдел 1', 
                position: 'Ведущий специалист',
                hireDate: '2021-01-10',
                dismissalDate: '',
                status: 'Активен',
                manager: 'Петров П.П.'
            },
            { 
                id: 'EMP004', 
                name: 'Козлов Дмитрий Владимирович', 
                department: 'Отдел 1', 
                position: 'Главный специалист',
                hireDate: '2019-09-05',
                dismissalDate: '2025-06-30',
                status: 'Уволен',
                manager: 'Петров П.П.'
            },
            { 
                id: 'EMP005', 
                name: 'Новиков Николай Николаевич', 
                department: 'Отдел 2', 
                position: 'Начальник отдела',
                hireDate: '2017-04-20',
                dismissalDate: '',
                status: 'Активен',
                manager: 'Сидоров С.С.'
            },
            { 
                id: 'EMP006', 
                name: 'Смирнов Алексей Алексеевич', 
                department: 'Отдел 2', 
                position: 'Ведущий специалист',
                hireDate: '2020-11-12',
                dismissalDate: '',
                status: 'Активен',
                manager: 'Новиков Н.Н.'
            },
            { 
                id: 'EMP007', 
                name: 'Орлова Ольга Олеговна', 
                department: 'Отдел 2', 
                position: 'Главный специалист',
                hireDate: '2019-02-03',
                dismissalDate: '',
                status: 'Активен',
                manager: 'Новиков Н.Н.'
            },
            { 
                id: 'EMP008', 
                name: 'Кириллов Кирилл Кириллович', 
                department: 'Отдел 2', 
                position: 'Ведущий специалист',
                hireDate: '2018-08-08',
                dismissalDate: '',
                status: 'Активен',
                manager: 'Новиков Н.Н.'
            },
            { 
                id: 'EMP009', 
                name: 'Федорова Фаина Федоровна', 
                department: 'Отдел 2', 
                position: 'Специалист',
                hireDate: '2025-03-15',
                dismissalDate: '',
                status: 'Активен',
                manager: 'Новиков Н.Н.'
            }
        ];
        
        // Начальные данные отсутствий
        this.data.absences = [
            { id: 'ABS001', employeeId: 'EMP001', startDate: '2025-01-20', endDate: '2025-01-31', type: 'Отпуск' },
            { id: 'ABS002', employeeId: 'EMP001', startDate: '2025-07-15', endDate: '2025-07-31', type: 'Отпуск' },
            { id: 'ABS003', employeeId: 'EMP002', startDate: '2025-02-10', endDate: '2025-02-28', type: 'Больничный' },
            { id: 'ABS004', employeeId: 'EMP002', startDate: '2025-08-01', endDate: '2025-08-31', type: 'Отпуск' },
            { id: 'ABS005', employeeId: 'EMP003', startDate: '2025-05-15', endDate: '2025-05-31', type: 'Отпуск' },
            { id: 'ABS006', employeeId: 'EMP003', startDate: '2025-11-15', endDate: '2025-11-30', type: 'Отпуск' },
            { id: 'ABS007', employeeId: 'EMP004', startDate: '2025-04-10', endDate: '2025-04-20', type: 'Больничный' },
            { id: 'ABS008', employeeId: 'EMP005', startDate: '2025-06-01', endDate: '2025-06-30', type: 'Отпуск' },
            { id: 'ABS009', employeeId: 'EMP006', startDate: '2025-03-10', endDate: '2025-03-20', type: 'Больничный' },
            { id: 'ABS010', employeeId: 'EMP006', startDate: '2025-09-01', endDate: '2025-09-30', type: 'Отпуск' },
            { id: 'ABS011', employeeId: 'EMP007', startDate: '2025-07-15', endDate: '2025-07-31', type: 'Отпуск' },
            { id: 'ABS012', employeeId: 'EMP008', startDate: '2025-04-20', endDate: '2025-04-30', type: 'Отпуск' },
            { id: 'ABS013', employeeId: 'EMP008', startDate: '2025-12-10', endDate: '2025-12-20', type: 'Больничный' },
            { id: 'ABS014', employeeId: 'EMP009', startDate: '2025-10-01', endDate: '2025-10-15', type: 'Отпуск' }
        ];
        
        // Начальные привязки отделов к БП
        this.data.departmentsBP = {
            'Отдел 1': ['BP01', 'BP02', 'BP03'],
            'Отдел 2': ['BP01', 'BP05', 'BP06']
        };
        
        this.saveAllData();
    }
    
    saveAllData() {
        localStorage.setItem('pshe_employees', JSON.stringify(this.data.employees));
        localStorage.setItem('pshe_absences', JSON.stringify(this.data.absences));
        localStorage.setItem('pshe_departmentsBP', JSON.stringify(this.data.departmentsBP));
        localStorage.setItem('pshe_psheData', JSON.stringify(this.data.psheData));
    }
    
    loadAllData() {
        this.data.employees = JSON.parse(localStorage.getItem('pshe_employees') || '[]');
        this.data.absences = JSON.parse(localStorage.getItem('pshe_absences') || '[]');
        this.data.departmentsBP = JSON.parse(localStorage.getItem('pshe_departmentsBP') || '{}');
        this.data.psheData = JSON.parse(localStorage.getItem('pshe_psheData') || '[]');
    }
    
    // ==================== ИНТЕРФЕЙС ====================
    
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
    
    initEventListeners() {
        // Кнопка сохранения распределения
        document.getElementById('save-distribution-btn').addEventListener('click', () => {
            this.saveDistribution();
        });
        
        // Кнопка копирования из прошлого месяца
        document.getElementById('copy-prev-btn').addEventListener('click', () => {
            this.copyFromPreviousMonth();
        });
        
        // Кнопка сохранения привязки БП
        document.getElementById('save-dept-bp-btn').addEventListener('click', () => {
            this.saveDepartmentBP();
        });
        
        // Кнопка добавления сотрудника
        document.getElementById('add-employee-btn').addEventListener('click', () => {
            this.showAddEmployeeModal();
        });
        
        // Кнопка сохранения сотрудника
        document.getElementById('save-employee-btn').addEventListener('click', () => {
            this.saveEmployee();
        });
        
        // Кнопка добавления отсутствия
        document.getElementById('add-absence-btn').addEventListener('click', () => {
            this.showAddAbsenceModal();
        });
        
        // Кнопка сохранения отсутствия
        document.getElementById('save-absence-btn').addEventListener('click', () => {
            this.saveAbsence();
        });
        
        // Кнопка очистки данных ПШЭ
        document.getElementById('clear-pshe-btn').addEventListener('click', () => {
            if (confirm('Вы уверены? Все данные ПШЭ будут удалены.')) {
                this.data.psheData = [];
                this.saveAllData();
                this.updatePSHEDataTable();
                this.showStatus('Данные ПШЭ очищены');
            }
        });
        
        // Кнопка генерации отчета
        document.getElementById('generate-report-btn').addEventListener('click', () => {
            this.generateAnnualReport();
        });
        
        // Кнопка печати отчета
        document.getElementById('print-report-btn').addEventListener('click', () => {
            window.print();
        });
        
        // Кнопка справки
        document.getElementById('help-btn').addEventListener('click', () => {
            this.showHelp();
        });
        
        // Кнопка сохранения всех данных
        document.getElementById('save-all-btn').addEventListener('click', () => {
            this.saveAllData();
            this.showStatus('Все данные сохранены');
        });
        
        // Закрытие модальных окон
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });
        
        // При изменении отдела в интерфейсе руководителя
        document.getElementById('department-select').addEventListener('change', () => {
            this.loadMonthData();
        });
        
        // При изменении месяца в интерфейсе руководителя
        document.getElementById('month-select').addEventListener('change', () => {
            this.loadMonthData();
        });
        
        // При изменении отдела в настройках БП
        document.getElementById('dept-bp-select').addEventListener('change', () => {
            this.updateBPList();
        });
        
        // При изменении отдела в отчете
        document.getElementById('report-dept-select').addEventListener('change', () => {
            this.generateAnnualReport();
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
                
                // Обновляем содержимое вкладки
                this.updateTabContent(tabId);
            });
        });
    }
    
    updateTabContent(tabId) {
        switch(tabId) {
            case 'employees':
                this.updateEmployeesTable();
                break;
            case 'absences':
                this.updateAbsencesTable();
                break;
            case 'bps':
                this.updateBPsTable();
                break;
            case 'departments':
                this.updateBPList();
                break;
            case 'pshe-data':
                this.updatePSHEDataTable();
                break;
        }
    }
    
    updatePageContent(pageId) {
        switch(pageId) {
            case 'data':
                // При переходе на страницу данных обновляем активную вкладку
                const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
                this.updateTabContent(activeTab);
                break;
            case 'report':
                this.generateAnnualReport();
                break;
        }
    }
    
    // ==================== РАСПРЕДЕЛЕНИЕ ПШЭ ====================
    
    loadMonthData() {
        const department = document.getElementById('department-select').value;
        const monthSelect = document.getElementById('month-select');
        const monthNumber = monthSelect.value;
        const monthText = monthSelect.options[monthSelect.selectedIndex].text;
        
        this.showStatus(`Загрузка данных: ${department}, ${monthText}`);
        
        // Получаем ВСЕХ сотрудников отдела (включая уволенных)
        const departmentEmployees = this.data.employees.filter(emp => 
            emp.department === department
        );
        
        // Получаем БП для отдела
        const departmentBP = this.data.departmentsBP[department] || [];
        
        // Обновляем заголовки БП в таблице
        this.updateBPHeaders(departmentBP);
        
        // Заполняем таблицу распределения
        this.fillDistributionTable(departmentEmployees, department, monthNumber, departmentBP);
    }
    
    updateBPHeaders(bpList) {
        // Обновляем заголовки столбцов БП
        for (let i = 1; i <= 3; i++) {
            const header = document.getElementById(`bp${i}-header`);
            const totalCell = document.getElementById(`total-bp${i}`);
            
            if (i <= bpList.length) {
                const bpId = bpList[i-1];
                const bp = this.data.businessProcesses.find(b => b.id === bpId);
                header.textContent = bpId;
                header.title = bp ? bp.name : '';
                header.style.display = 'table-cell';
                if (totalCell) totalCell.style.display = 'table-cell';
            } else {
                header.style.display = 'none';
                if (totalCell) totalCell.style.display = 'none';
            }
        }
    }
    
    fillDistributionTable(employees, department, monthNumber, bpList) {
        const tbody = document.getElementById('distribution-body');
        tbody.innerHTML = '';
        
        if (employees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; padding: 20px;">Нет сотрудников в отделе</td></tr>`;
            this.updateTotals();
            return;
        }
        
        // Получаем рабочие дни для месяца
        const workingDays = this.getWorkingDaysForMonth(monthNumber);
        const month = parseInt(monthNumber);
        
        // Сортируем сотрудников: сначала активные, потом уволенные
        const sortedEmployees = [...employees].sort((a, b) => {
            if (a.status === 'Активен' && b.status !== 'Активен') return -1;
            if (a.status !== 'Активен' && b.status === 'Активен') return 1;
            return 0;
        });
        
        sortedEmployees.forEach((emp, index) => {
            const row = document.createElement('tr');
            
            // Определяем статус для этого месяца
            const monthStatus = this.getEmployeeStatusForMonth(emp, month);
            
            // Рассчитываем доступные дни автоматически
            const availableDays = this.calculateAvailableDays(emp.id, monthNumber, workingDays);
            
            // Получаем информацию об отсутствиях/увольнении
            const absenceInfo = this.getEmployeeAbsenceInfo(emp.id, monthNumber, emp);
            
            // Получаем сохраненное распределение
            const savedDistribution = this.getSavedDistribution(emp.id, department, monthNumber, bpList);
            
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
                               value="${savedValue.toFixed(2)}"
                               min="0" 
                               max="1" 
                               step="0.05"
                               onchange="psheTracker.updateDistributionSum(this)">
                    </td>
                `;
            });
            
            // Если БП меньше 3, добавляем пустые ячейки
            for (let i = bpList.length; i < 3; i++) {
                bpCells += '<td style="display: none;"></td>';
            }
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${emp.name}</td>
                <td>${emp.id}</td>
                <td>
                    <span class="status-badge ${monthStatus === 'Активен' ? 'active' : 'inactive'}">
                        ${monthStatus}
                    </span>
                </td>
                <td>${absenceInfo}</td>
                <td>${workingDays}</td>
                <td>
                    <input type="number" 
                           class="distribution-input" 
                           data-emp="${emp.id}"
                           id="available-${emp.id}"
                           value="${availableDays}"
                           min="0" 
                           max="${workingDays}"
                           step="1"
                           onchange="psheTracker.updateTotals()">
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
    
    getWorkingDaysForMonth(monthNumber) {
        const workingDaysMap = {
            '01': 17, '02': 20, '03': 21, '04': 22, '05': 18, '06': 19,
            '07': 23, '08': 21, '09': 22, '10': 23, '11': 19, '12': 22
        };
        return workingDaysMap[monthNumber] || 21;
    }
    
    getEmployeeStatusForMonth(employee, month) {
        // Если сотрудник имеет дату увольнения
        if (employee.dismissalDate) {
            const dismissalDate = new Date(employee.dismissalDate);
            const dismissalMonth = dismissalDate.getMonth() + 1;
            
            // Если уволен в этом месяце или ранее
            if (dismissalMonth <= month) {
                // Если уволен именно в этом месяце - показываем "Уволен"
                if (dismissalMonth === month) {
                    return 'Уволен';
                } else {
                    // Уволен в предыдущем месяце - не показываем в таблице вообще
                    // но для отображения статуса оставим "Уволен"
                    return 'Уволен';
                }
            }
        }
        
        // Во всех остальных случаях - "Активен"
        return 'Активен';
    }
    
    getEmployeeAbsenceInfo(employeeId, monthNumber, employee) {
        const month = parseInt(monthNumber);
        const year = 2025;
        
        // Проверяем увольнение в этом месяце
        if (employee.dismissalDate) {
            const dismissalDate = new Date(employee.dismissalDate);
            const dismissalMonth = dismissalDate.getMonth() + 1;
            
            if (dismissalMonth === month) {
                return `Уволен ${this.formatDate(dismissalDate)}`;
            }
        }
        
        // Получаем отсутствия сотрудника в этом месяце
        const absences = this.data.absences.filter(abs => {
            if (abs.employeeId !== employeeId) return false;
            
            const startDate = new Date(abs.startDate);
            const endDate = new Date(abs.endDate);
            
            // Проверяем, что отсутствие в 2025 году
            if (startDate.getFullYear() !== year || endDate.getFullYear() !== year) return false;
            
            // Проверяем, пересекается ли отсутствие с месяцем
            const startMonth = startDate.getMonth() + 1;
            const endMonth = endDate.getMonth() + 1;
            
            return (startMonth === month || endMonth === month || 
                   (startMonth < month && endMonth > month));
        });
        
        if (absences.length === 0) {
            return 'Нет';
        }
        
        // Формируем информацию об отсутствиях
        const absenceInfo = [];
        absences.forEach(abs => {
            const startDate = new Date(abs.startDate);
            const endDate = new Date(abs.endDate);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            absenceInfo.push(`${abs.type} ${days} дн.`);
        });
        
        return absenceInfo.join(', ');
    }
    
    calculateAvailableDays(employeeId, monthNumber, totalWorkingDays) {
        const employee = this.data.employees.find(emp => emp.id === employeeId);
        if (!employee) return 0;
        
        const month = parseInt(monthNumber);
        const year = 2025;
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);
        
        // Проверяем увольнение
        if (employee.dismissalDate) {
            const dismissalDate = new Date(employee.dismissalDate);
            const dismissalMonth = dismissalDate.getMonth() + 1;
            
            // Если уволен до этого месяца - 0 дней
            if (dismissalMonth < month) {
                return 0;
            }
            
            // Если уволен в этом месяце - рассчитываем дни до увольнения
            if (dismissalMonth === month) {
                const daysToDismissal = dismissalDate.getDate(); // Дней от начала месяца до увольнения включительно
                const daysInMonth = monthEnd.getDate();
                const workingDaysToDismissal = Math.round(daysToDismissal * totalWorkingDays / daysInMonth);
                
                // Учитываем отсутствия до даты увольнения
                const absences = this.getAbsencesInMonth(employeeId, monthNumber);
                let absentDays = 0;
                
                absences.forEach(abs => {
                    const absenceStart = new Date(abs.startDate);
                    const absenceEnd = new Date(abs.endDate);
                    
                    // Учитываем только отсутствия до даты увольнения
                    if (absenceStart <= dismissalDate) {
                        const effectiveEnd = absenceEnd > dismissalDate ? dismissalDate : absenceEnd;
                        const daysAbsent = Math.ceil((effectiveEnd - absenceStart) / (1000 * 60 * 60 * 24)) + 1;
                        absentDays += daysAbsent;
                    }
                });
                
                // Преобразуем календарные дни отсутствия в рабочие дни
                const absentWorkingDays = Math.round(absentDays * totalWorkingDays / daysInMonth);
                return Math.max(0, workingDaysToDismissal - absentWorkingDays);
            }
        }
        
        // Проверяем, принят ли сотрудник после начала месяца
        if (employee.hireDate) {
            const hireDate = new Date(employee.hireDate);
            if (hireDate > monthEnd) {
                // Сотрудник принят после этого месяца
                return 0;
            } else if (hireDate > monthStart) {
                // Сотрудник принят в течение месяца
                const daysFromHire = Math.ceil((monthEnd - hireDate) / (1000 * 60 * 60 * 24)) + 1;
                const daysInMonth = monthEnd.getDate();
                const workingDaysFromHire = Math.round(daysFromHire * totalWorkingDays / daysInMonth);
                
                // Учитываем отсутствия
                const absences = this.getAbsencesInMonth(employeeId, monthNumber);
                let absentDays = 0;
                
                absences.forEach(abs => {
                    const absenceStart = new Date(abs.startDate);
                    const absenceEnd = new Date(abs.endDate);
                    
                    // Учитываем только отсутствия после даты приема
                    if (absenceEnd >= hireDate) {
                        const effectiveStart = absenceStart < hireDate ? hireDate : absenceStart;
                        const daysAbsent = Math.ceil((absenceEnd - effectiveStart) / (1000 * 60 * 60 * 24)) + 1;
                        absentDays += daysAbsent;
                    }
                });
                
                const absentWorkingDays = Math.round(absentDays * totalWorkingDays / daysInMonth);
                return Math.max(0, workingDaysFromHire - absentWorkingDays);
            }
        }
        
        // Активный сотрудник, работающий весь месяц
        // Получаем отсутствия сотрудника в этом месяце
        const absences = this.getAbsencesInMonth(employeeId, monthNumber);
        
        // Если нет отсутствий - все рабочие дни доступны
        if (absences.length === 0) {
            return totalWorkingDays;
        }
        
        // Рассчитываем общее количество дней отсутствия
        let totalAbsentDays = 0;
        absences.forEach(abs => {
            totalAbsentDays += abs.days;
        });
        
        // Преобразуем календарные дни в рабочие
        const daysInMonth = monthEnd.getDate();
        const absentWorkingDays = Math.round(totalAbsentDays * totalWorkingDays / daysInMonth);
        
        return Math.max(0, totalWorkingDays - absentWorkingDays);
    }
    
    getAbsencesInMonth(employeeId, monthNumber) {
        const month = parseInt(monthNumber);
        const year = 2025;
        
        return this.data.absences.filter(abs => {
            if (abs.employeeId !== employeeId) return false;
            
            const startDate = new Date(abs.startDate);
            const endDate = new Date(abs.endDate);
            
            // Проверяем, что отсутствие в 2025 году
            if (startDate.getFullYear() !== year || endDate.getFullYear() !== year) return false;
            
            // Проверяем, пересекается ли отсутствие с месяцем
            const startMonth = startDate.getMonth() + 1;
            const endMonth = endDate.getMonth() + 1;
            
            return (startMonth === month || endMonth === month || 
                   (startMonth < month && endMonth > month));
        }).map(abs => {
            const startDate = new Date(abs.startDate);
            const endDate = new Date(abs.endDate);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            return { ...abs, days };
        });
    }
    
    getSavedDistribution(employeeId, department, monthNumber, bpList) {
        const saved = this.data.psheData.find(data => 
            data.employeeId === employeeId && 
            data.department === department && 
            data.month === monthNumber
        );
        
        if (!saved) {
            // Равномерное распределение по умолчанию
            const defaultDistribution = {};
            const equalShare = bpList.length > 0 ? 1 / bpList.length : 0;
            bpList.forEach(bp => {
                defaultDistribution[bp] = parseFloat(equalShare.toFixed(2));
            });
            return defaultDistribution;
        }
        
        return saved.distribution;
    }
    
    updateDistributionSum(input) {
        const empId = input.dataset.emp;
        const value = parseFloat(input.value) || 0;
        
        // Находим все инпуты для этого сотрудника
        const empInputs = document.querySelectorAll(`.distribution-input[data-emp="${empId}"][data-bp]`);
        let sum = 0;
        
        empInputs.forEach(inp => {
            sum += parseFloat(inp.value) || 0;
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
            checkCell.innerHTML = '<i class="fas fa-times-circle invalid"></i>';
        }
        
        // Обновляем итоги
        this.updateTotals();
    }
    
    updateTotals() {
        const department = document.getElementById('department-select').value;
        const monthNumber = document.getElementById('month-select').value;
        const bpList = this.data.departmentsBP[department] || [];
        const workingDays = this.getWorkingDaysForMonth(monthNumber);
        
        const totals = {};
        bpList.forEach(bp => {
            totals[bp] = 0;
        });
        
        // Считаем фактические ПШЭ для каждого БП
        const rows = document.querySelectorAll('#distribution-body tr');
        rows.forEach(row => {
            const empId = row.querySelector('input[data-emp]')?.dataset.emp;
            if (!empId) return;
            
            const availableInput = document.getElementById(`available-${empId}`);
            const availableDays = parseFloat(availableInput?.value) || 0;
            
            bpList.forEach(bp => {
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
            }
        });
        
        // Общая сумма
        const totalSum = Object.values(totals).reduce((sum, val) => sum + val, 0);
        document.getElementById('total-sum').textContent = totalSum.toFixed(2);
        
        // Проверка валидации
        this.updateValidationStatus();
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
        } else if (rows.length === 0) {
            validationStatus.innerHTML = '<i class="fas fa-info-circle"></i> Нет данных для отображения';
        } else {
            validationStatus.innerHTML = '<i class="fas fa-exclamation-triangle invalid"></i> Есть ошибки в распределении';
        }
    }
    
    saveDistribution() {
        const department = document.getElementById('department-select').value;
        const monthSelect = document.getElementById('month-select');
        const monthNumber = monthSelect.value;
        
        const rows = document.querySelectorAll('#distribution-body tr');
        const bpList = this.data.departmentsBP[department] || [];
        
        let hasErrors = false;
        const errorMessages = [];
        
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
                const employee = this.data.employees.find(emp => emp.id === empId);
                errorMessages.push(`${employee?.name || empId}: сумма распределения ${totalShare.toFixed(2)} не равна 1.0`);
                hasErrors = true;
                return;
            }
            
            // Сохраняем данные
            this.savePSHEData(empId, department, monthNumber, distribution, availableDays);
        });
        
        if (hasErrors) {
            alert('Ошибки при сохранении:\n' + errorMessages.join('\n'));
            this.showStatus('Есть ошибки в распределении');
        } else {
            this.showStatus('Распределение успешно сохранено');
            alert('Данные успешно сохранены!');
        }
    }
    
    savePSHEData(employeeId, department, monthNumber, distribution, availableDays) {
        // Ищем существующую запись
        const existingIndex = this.data.psheData.findIndex(data => 
            data.employeeId === employeeId && 
            data.department === department && 
            data.month === monthNumber
        );
        
        const employee = this.data.employees.find(emp => emp.id === employeeId);
        
        const data = {
            id: `PSHE${Date.now()}`,
            employeeId: employeeId,
            employeeName: employee ? employee.name : 'Неизвестно',
            department: department,
            month: monthNumber,
            distribution: distribution,
            availableDays: availableDays,
            savedAt: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            this.data.psheData[existingIndex] = data;
        } else {
            this.data.psheData.push(data);
        }
        
        this.saveAllData();
        this.updatePSHEDataTable();
    }
    
    copyFromPreviousMonth() {
        const currentMonth = document.getElementById('month-select').value;
        const prevMonth = (parseInt(currentMonth) - 1).toString().padStart(2, '0');
        
        if (prevMonth === '00') {
            alert('Невозможно скопировать из предыдущего месяца для января');
            return;
        }
        
        if (confirm(`Скопировать распределение из ${this.getMonthName(prevMonth)}?`)) {
            const department = document.getElementById('department-select').value;
            
            // Получаем данные за предыдущий месяц
            const prevMonthData = this.data.psheData.filter(data => 
                data.department === department && data.month === prevMonth
            );
            
            if (prevMonthData.length === 0) {
                alert('Нет данных за предыдущий месяц');
                return;
            }
            
            // Обновляем текущий месяц данными из предыдущего
            prevMonthData.forEach(data => {
                this.savePSHEData(data.employeeId, department, currentMonth, data.distribution, data.availableDays);
            });
            
            // Перезагружаем текущий месяц
            this.loadMonthData();
            this.showStatus(`Распределение скопировано из ${this.getMonthName(prevMonth)}`);
        }
    }
    
    resetEmployeeDistribution(employeeId) {
        if (confirm('Сбросить распределение для этого сотрудника?')) {
            const department = document.getElementById('department-select').value;
            const bpList = this.data.departmentsBP[department] || [];
            
            if (bpList.length === 0) {
                alert('Для этого отдела не назначены бизнес-процессы');
                return;
            }
            
            // Равномерное распределение
            const equalShare = parseFloat((1 / bpList.length).toFixed(2));
            
            // Находим все инпуты для сотрудника и обновляем их
            bpList.forEach((bp, index) => {
                const input = document.querySelector(`.distribution-input[data-emp="${employeeId}"][data-bp="${bp}"]`);
                if (input) {
                    // Для последнего БП корректируем сумму, чтобы была равна 1.0
                    const value = (index === bpList.length - 1) ? 
                        parseFloat((1 - equalShare * (bpList.length - 1)).toFixed(2)) : equalShare;
                    input.value = value;
                    this.updateDistributionSum(input);
                }
            });
            
            this.showStatus('Распределение сброшено');
        }
    }
    
    // ==================== УПРАВЛЕНИЕ ДАННЫМИ ====================
    
    updateEmployeesTable() {
        const tbody = document.getElementById('employees-body');
        tbody.innerHTML = '';
        
        this.data.employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>${this.formatDate(new Date(emp.hireDate))}</td>
                <td>${emp.dismissalDate ? this.formatDate(new Date(emp.dismissalDate)) : '-'}</td>
                <td><span class="status-badge ${emp.status === 'Активен' ? 'active' : 'inactive'}">${emp.status}</span></td>
                <td>${emp.manager || '-'}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="psheTracker.deleteEmployee('${emp.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    updateAbsencesTable() {
        const tbody = document.getElementById('absences-body');
        tbody.innerHTML = '';
        
        this.data.absences.forEach(abs => {
            const employee = this.data.employees.find(emp => emp.id === abs.employeeId);
            const startDate = new Date(abs.startDate);
            const endDate = new Date(abs.endDate);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee ? employee.name : 'Неизвестно'}</td>
                <td>${this.formatDate(startDate)}</td>
                <td>${this.formatDate(endDate)}</td>
                <td>${abs.type}</td>
                <td>${days}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="psheTracker.deleteAbsence('${abs.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    updateBPsTable() {
        const tbody = document.getElementById('bps-body');
        tbody.innerHTML = '';
        
        this.data.businessProcesses.forEach(bp => {
            const row = document.createElement('tr');
            
            // Находим отделы, которые используют этот БП
            const usingDepartments = [];
            Object.keys(this.data.departmentsBP).forEach(dept => {
                if (this.data.departmentsBP[dept].includes(bp.id)) {
                    usingDepartments.push(dept);
                }
            });
            
            row.innerHTML = `
                <td>${bp.id}</td>
                <td>${bp.name}</td>
                <td>${usingDepartments.length > 0 ? usingDepartments.join(', ') : 'Не используется'}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    updatePSHEDataTable() {
        const tbody = document.getElementById('pshe-data-body');
        tbody.innerHTML = '';
        
        this.data.psheData.forEach(data => {
            const row = document.createElement('tr');
            const savedDate = new Date(data.savedAt);
            
            // Форматируем распределение
            const distributionText = Object.entries(data.distribution)
                .map(([bp, value]) => `${bp}: ${value.toFixed(2)}`)
                .join(', ');
            
            row.innerHTML = `
                <td>${data.id}</td>
                <td>${data.employeeName}</td>
                <td>${data.department}</td>
                <td>${this.getMonthName(data.month)} 2025</td>
                <td>${distributionText}</td>
                <td>${this.formatDate(savedDate)} ${savedDate.toLocaleTimeString()}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="psheTracker.deletePSHEData('${data.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    updateBPList() {
        const department = document.getElementById('dept-bp-select').value;
        const bpList = document.getElementById('bp-list');
        bpList.innerHTML = '';
        
        const selectedBP = this.data.departmentsBP[department] || [];
        
        this.data.businessProcesses.forEach(bp => {
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
    
    saveDepartmentBP() {
        const department = document.getElementById('dept-bp-select').value;
        const checkboxes = document.querySelectorAll('.bp-item input:checked');
        const selectedBP = Array.from(checkboxes).map(cb => cb.value);
        
        this.data.departmentsBP[department] = selectedBP;
        this.saveAllData();
        
        // Обновляем таблицу бизнес-процессов
        this.updateBPsTable();
        
        // Обновляем интерфейс руководителя, если он активен
        const currentDept = document.getElementById('department-select').value;
        if (currentDept === department) {
            this.loadMonthData();
        }
        
        this.showStatus(`Привязка БП для ${department} сохранена`);
        alert('Привязка сохранена!');
    }
    
    showAddEmployeeModal() {
        document.getElementById('emp-id').value = `EMP${(this.data.employees.length + 1).toString().padStart(3, '0')}`;
        document.getElementById('emp-name').value = '';
        document.getElementById('emp-dept').value = 'Отдел 1';
        document.getElementById('emp-position').value = 'Специалист';
        document.getElementById('emp-hire-date').value = '2025-01-01';
        document.getElementById('emp-manager').value = '';
        
        document.getElementById('add-employee-modal').style.display = 'flex';
    }
    
    saveEmployee() {
        const id = document.getElementById('emp-id').value.trim();
        const name = document.getElementById('emp-name').value.trim();
        const department = document.getElementById('emp-dept').value;
        const position = document.getElementById('emp-position').value.trim();
        const hireDate = document.getElementById('emp-hire-date').value;
        const manager = document.getElementById('emp-manager').value;
        
        if (!id || !name || !position || !hireDate) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Проверяем, существует ли уже сотрудник с таким ID
        if (this.data.employees.some(emp => emp.id === id)) {
            alert('Сотрудник с таким табельным номером уже существует');
            return;
        }
        
        const newEmployee = {
            id: id,
            name: name,
            department: department,
            position: position,
            hireDate: hireDate,
            dismissalDate: '',
            status: 'Активен',
            manager: manager
        };
        
        this.data.employees.push(newEmployee);
        this.saveAllData();
        this.updateEmployeesTable();
        
        // Закрываем модальное окно
        this.closeModals();
        
        this.showStatus(`Сотрудник ${name} добавлен`);
        alert('Сотрудник успешно добавлен!');
    }
    
    deleteEmployee(employeeId) {
        if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            const index = this.data.employees.findIndex(emp => emp.id === employeeId);
            if (index !== -1) {
                const employeeName = this.data.employees[index].name;
                this.data.employees.splice(index, 1);
                
                // Удаляем связанные отсутствия
                this.data.absences = this.data.absences.filter(abs => abs.employeeId !== employeeId);
                
                // Удаляем связанные данные ПШЭ
                this.data.psheData = this.data.psheData.filter(data => data.employeeId !== employeeId);
                
                this.saveAllData();
                this.updateEmployeesTable();
                this.updateAbsencesTable();
                this.updatePSHEDataTable();
                
                // Перезагружаем интерфейс руководителя
                this.loadMonthData();
                
                this.showStatus(`Сотрудник ${employeeName} удален`);
            }
        }
    }
    
    showAddAbsenceModal() {
        const select = document.getElementById('absence-emp-id');
        select.innerHTML = '';
        
        this.data.employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id;
            option.textContent = `${emp.name} (${emp.id})`;
            select.appendChild(option);
        });
        
        document.getElementById('absence-start').value = '2025-01-01';
        document.getElementById('absence-end').value = '2025-01-05';
        document.getElementById('absence-type').value = 'Отпуск';
        
        document.getElementById('add-absence-modal').style.display = 'flex';
    }
    
    saveAbsence() {
        const employeeId = document.getElementById('absence-emp-id').value;
        const type = document.getElementById('absence-type').value;
        const startDate = document.getElementById('absence-start').value;
        const endDate = document.getElementById('absence-end').value;
        
        if (!employeeId || !startDate || !endDate) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
            alert('Дата завершения не может быть раньше даты начала');
            return;
        }
        
        // Проверяем, что дата в 2025 году
        if (start.getFullYear() !== 2025 || end.getFullYear() !== 2025) {
            alert('Даты должны быть в 2025 году');
            return;
        }
        
        const newAbsence = {
            id: `ABS${Date.now()}`,
            employeeId: employeeId,
            startDate: startDate,
            endDate: endDate,
            type: type
        };
        
        this.data.absences.push(newAbsence);
        this.saveAllData();
        this.updateAbsencesTable();
        
        // Закрываем модальное окно
        this.closeModals();
        
        this.showStatus(`Отсутствие добавлено`);
        alert('Отсутствие успешно добавлено!');
    }
    
    deleteAbsence(absenceId) {
        if (confirm('Вы уверены, что хотите удалить это отсутствие?')) {
            const index = this.data.absences.findIndex(abs => abs.id === absenceId);
            if (index !== -1) {
                this.data.absences.splice(index, 1);
                this.saveAllData();
                this.updateAbsencesTable();
                
                // Перезагружаем интерфейс руководителя
                this.loadMonthData();
                
                this.showStatus('Отсутствие удалено');
            }
        }
    }
    
    deletePSHEData(psheId) {
        if (confirm('Вы уверены, что хотите удалить эти данные ПШЭ?')) {
            const index = this.data.psheData.findIndex(data => data.id === psheId);
            if (index !== -1) {
                this.data.psheData.splice(index, 1);
                this.saveAllData();
                this.updatePSHEDataTable();
                
                // Перезагружаем интерфейс руководителя
                this.loadMonthData();
                
                this.showStatus('Данные ПШЭ удалены');
            }
        }
    }
    
    // ==================== ГОДОВОЙ ОТЧЕТ ====================
    
    generateAnnualReport() {
        const department = document.getElementById('report-dept-select').value;
        const bpList = this.data.departmentsBP[department] || [];
        
        // Инициализируем данные для отчета
        const reportData = {};
        bpList.forEach(bp => {
            reportData[bp] = Array(12).fill(0);
        });
        
        // Агрегируем данные за год
        this.data.psheData.forEach(data => {
            if (data.department === department && data.month) {
                const monthIndex = parseInt(data.month) - 1;
                const workingDays = this.getWorkingDaysForMonth(data.month);
                
                Object.entries(data.distribution).forEach(([bp, share]) => {
                    if (reportData[bp]) {
                        const factPSHE = share * (data.availableDays / workingDays);
                        reportData[bp][monthIndex] += factPSHE;
                    }
                });
            }
        });
        
        // Заполняем таблицу отчета
        this.fillAnnualReportTable(reportData, bpList, department);
    }
    
    fillAnnualReportTable(reportData, bpList, department) {
        const tbody = document.getElementById('annual-report-body');
        tbody.innerHTML = '';
        
        if (bpList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="14" style="text-align: center; padding: 20px;">Для отдела ${department} не назначены бизнес-процессы</td></tr>`;
            return;
        }
        
        // Проверяем, есть ли данные для отчета
        let hasData = false;
        Object.values(reportData).forEach(data => {
            if (data.some(value => value > 0)) {
                hasData = true;
            }
        });
        
        if (!hasData) {
            tbody.innerHTML = `<tr><td colspan="14" style="text-align: center; padding: 20px;">Нет данных ПШЭ для отдела ${department}</td></tr>`;
            return;
        }
        
        bpList.forEach(bpId => {
            const bp = this.data.businessProcesses.find(b => b.id === bpId);
            const rowData = reportData[bpId];
            const total = rowData.reduce((sum, val) => sum + val, 0);
            const average = total / 12; // Среднее за год
            
            const row = document.createElement('tr');
            let cells = `<td><strong>${bpId}</strong> - ${bp ? bp.name : ''}</td>`;
            
            rowData.forEach((value, index) => {
                cells += `<td>${value.toFixed(2)}</td>`;
            });
            
            cells += `<td><strong>${average.toFixed(2)}</strong></td>`;
            row.innerHTML = cells;
            tbody.appendChild(row);
        });
        
        // Добавляем строку итогов
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.style.backgroundColor = '#f1f8ff';
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
        const grandAverage = grandTotal / 12;
        totalCells += `<td><strong>${grandAverage.toFixed(2)}</strong></td>`;
        
        totalRow.innerHTML = totalCells;
        tbody.appendChild(totalRow);
        
        // Обновляем информацию о отделе
        const activeEmployees = this.data.employees.filter(emp => 
            emp.department === department && emp.status === 'Активен'
        ).length;
        
        this.showStatus(`Отчет для ${department} сгенерирован (${activeEmployees} активных сотрудников)`);
    }
    
    // ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
    
    formatDate(date) {
        if (!date) return '';
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    getMonthName(monthNumber) {
        const monthNames = {
            '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
            '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
            '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь'
        };
        return monthNames[monthNumber] || 'Неизвестно';
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
    
    showHelp() {
        document.getElementById('help-modal').style.display = 'flex';
    }
    
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Инициализация приложения
let psheTracker;

document.addEventListener('DOMContentLoaded', () => {
    psheTracker = new PsheTracker();
    window.psheTracker = psheTracker; // Делаем глобальным для вызовов из HTML
    
    // Автоматическая загрузка данных при изменении выбора
    document.getElementById('department-select').addEventListener('change', () => {
        psheTracker.loadMonthData();
    });
    
    document.getElementById('month-select').addEventListener('change', () => {
        psheTracker.loadMonthData();
    });
});
