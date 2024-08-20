const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees);
}

const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        res.status(400).json({ 'message': 'firstname and lastname are required' });
    }
    try {
        const newEmployee = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error(error);
    }
}
const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        res.status(400).json({ 'message': 'Employee ID parameter is required' });
    }
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        res.status(400).json({ 'message': `Employee id ${req.body.id} not found` });
    }
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();

    res.json(result);
}
const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) {
        res.status(400).json({ 'message': 'Employee ID parameter is required' });
    }
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
       return res.status(204).json({ 'message': `No Employee matches id ${req.body.id}` });
    }
    const result = await employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getEmployeeById = async (req, res) => {
    if (!req?.params?.id) {
        res.status(400).json({ 'message': 'Employee ID parameter is required' });
    }
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        res.status(204).json({ 'message': `No Employee matches id ${req.params.id}` });
    }
    res.json(employee);
}

module.exports = { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployeeById };