var LoginView = soma.View.extend({
	message: null,
	username: null,
	password: null,
	login: null,
	init: function() {
		this.message = document.getElementById('message');
		this.username = document.getElementById('username');
		this.password = document.getElementById('password');
		this.login = document.getElementById('login');
		this.login.addEventListener('click', this.clickHandler.bind(this), false);
	},
	clickHandler: function(event){
		event.preventDefault();
		var vo = new LoginVO(this.username.value, this.password.value);
		this.dispatchEvent(new LoginEvent(LoginEvent.LOGIN, vo, "Please wait..."));
	},
	showMessage: function(message) {
		this.message.style.color = "#000000";
		this.message.innerHTML = message;
	},
	showMessageError: function(message) {
		console.log("---------", message);
		this.message.style.color = "#FF0000";
		this.message.innerHTML = message;
	}
});
LoginView.NAME = "View::LoginView";

var EmployeeListView = soma.View.extend({
	logout: null,
	tableList: null,
	tableListContainer: null,
	create: null,
    shouldAutobind: false,
	init: function() {
		this.tableListContainer = document.getElementById('list-table-container');
		this.logout = document.getElementById('buttonLogoutList');
		this.logout.addEventListener('click', this.logoutClickHandler, false);
		this.create = document.getElementById('buttonCreate');
		this.create.addEventListener('click', this.createClickHandler, false);
	},
	logoutClickHandler: function(event){
		event.preventDefault();
		this.dispatchEvent(new LoginEvent(LoginEvent.LOGOUT));
	},
	createClickHandler: function(event){
		event.preventDefault();
		this.dispatchEvent(new NavigationEvent(NavigationEvent.SELECT, NavigationConstants.EMPLOYEE_DETAILS));
	},
	updateList: function(data) {
		this.tableListContainer.innerHTML = '<table cellpadding="0" cellspacing="0" border="0" width="100%" id="employee-list-table"><tr class="header"><th width="50%">Name</th><th>Age</th></tr></table>';
		this.tableList = document.getElementById('employee-list-table');
		for (var i = 0; i < data.length; i++) {
			var row = document.createElement("tr");
			row.addEventListener("click", this.rowClickHandler, false);
			var cellId = document.createElement("td");
			var cellName = document.createElement("td");
			var cellAge = document.createElement("td");
			var textId = document.createTextNode(data[i].id);
			var textName = document.createTextNode(data[i].name);
			var textAge = document.createTextNode(data[i].age);
			cellId.appendChild(textId);
			cellName.appendChild(textName);
			cellAge.appendChild(textAge);
			row.appendChild(cellId);
			row.appendChild(cellName);
			row.appendChild(cellAge);
			cellId.style.display = "none"; // hide id cell
			this.tableList.appendChild(row);
		}
	},
	rowClickHandler: function(event) {
		var vo = new EmployeeVO();
		console.log(this);
		console.log(this.childNodes[0]);
		console.log(this.childNodes[0].textContent);
		vo.id = this.childNodes[0].textContent;
		vo.name = this.childNodes[1].textContent;
		vo.age = this.childNodes[2].textContent;
		this.dispatchEvent(new EmployeeEvent(EmployeeEvent.SELECT, vo));
		this.dispatchEvent(new NavigationEvent(NavigationEvent.SELECT, NavigationConstants.EMPLOYEE_DETAILS));
	}
});
EmployeeListView.NAME = "View::EmployeeListView";

var EmployeeEditView = soma.View.extend({
	employee:null,
	logout: null,
	cancel: null,
	submit: null,
	deleteEmployee: null,
	inputName: null,
	inputAge: null,
    shouldAutobind: true,
	init: function() {
		this.logout = document.getElementById('buttonLogoutEdit');
		this.logout.addEventListener('click', this.logoutClickHandler, false);
		this.cancel = document.getElementById('button-edit-cancel');
		this.cancel.addEventListener('click', this.cancelClickHandler, false);
		this.submit = document.getElementById('button-edit-submit');
		this.submit.addEventListener('click', this.submitClickHandler, false);
		this.deleteEmployee = document.getElementById('buttonDelete');
		this.deleteEmployee.addEventListener('click', this.deleteClickHandler, false);
		this.inputName = document.getElementById('employeeName');
		this.inputAge = document.getElementById('employeeAge');
	},
	logoutClickHandler: function(event){
		event.preventDefault();
		this.dispatchEvent(new LoginEvent(LoginEvent.LOGOUT));
		this.leaveForm();
	},
	deleteClickHandler: function(event) {
		event.preventDefault();
		this.dispatchEvent(new EmployeeEvent(EmployeeEvent.DELETE, this.employee));
		this.leaveForm();
	},
	cancelClickHandler: function(event) {
		event.preventDefault();
		this.dispatchEvent(new NavigationEvent(NavigationEvent.SELECT, NavigationConstants.EMPLOYEE_LIST));
		this.leaveForm();
	},
	submitClickHandler: function(event) {
		event.preventDefault();
		if (this.employee == null) this.employee = new EmployeeVO();
		this.employee.name = this.inputName.value;
		this.employee.age = this.inputAge.value;
		if (this.employee.name == null || this.employee.name == "" || this.employee.age == null || this.employee.age == "") return;
		if (this.employee.id == null) {
			this.dispatchEvent(new EmployeeEvent(EmployeeEvent.CREATE, this.employee));
		}
		else {
			this.dispatchEvent(new EmployeeEvent(EmployeeEvent.EDIT, this.employee));
		}
		this.leaveForm();
	},
	leaveForm:function() {
		this.dispatchEvent(new NavigationEvent(NavigationEvent.SELECT, NavigationConstants.EMPLOYEE_LIST));
		this.inputName.value = "";
		this.inputAge.value = "";
		this.employee = null;
	},
	updateFields: function(vo) {
		this.employee = vo;
		this.inputName.value = this.employee.name;
		this.inputAge.value = this.employee.age;
	}
});
EmployeeEditView.NAME = "View::EmployeeEditView";

