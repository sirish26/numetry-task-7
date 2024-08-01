import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [phno, setPhno] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('https://661f680b16358961cd943745.mockapi.io/employe')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://661f680b16358961cd943745.mockapi.io/employe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phno,
          email,
          role,
        }),
      });
      const data = await response.json();
      console.log('New employee added:', data);
      setEmployees([...employees, data]);
      setName('');
      setPhno('');
      setEmail('');
      setRole('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const del = async (id) => {
    try {
      const response = await fetch(`https://661f680b16358961cd943745.mockapi.io/employe/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Employee deleted');
        setEmployees(employees.filter(emp => emp.id !== id));
      } else {
        console.error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const edit = (id) => {
    const employeeToEdit = employees.find(emp => emp.id === id);
    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setPhno(employeeToEdit.phno);
      setEmail(employeeToEdit.email);
      setRole(employeeToEdit.role);
      setEditingId(id);
    }
  };

  const update = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://661f680b16358961cd943745.mockapi.io/employe/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phno,
          email,
          role,
        }),
      });
      if (response.ok) {
        console.log('Employee updated');
        const updatedEmployees = employees.map(emp =>
          emp.id === editingId ? { ...emp, name, phno, email, role } : emp
        );
        setEmployees(updatedEmployees);
        setName('');
        setPhno('');
        setEmail('');
        setRole('');
        setEditingId(null);
      } else {
        console.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Employee Data</h1>
      <form onSubmit={editingId ? update : add}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phno}
          onChange={(e) => setPhno(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button type="submit">{editingId ? 'Update Employee' : 'Add Employee'}</button>
        <br></br>
        {editingId && <button onClick={() => setEditingId(null)}>Cancel</button>}
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.phno}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>
                <button onClick={() => edit(employee.id)}>Edit</button>
                <button onClick={() => del(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;