INSERT INTO department (id, dep_name)
VALUES (1, "Engineering"),
       (2, "Finance"),
       (3, "Legal"),
       (4, "Sales"),
       (5, "Marketting");
       
INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sale Lead", 100000, 4),
       (2, "Salesperson", 80000, 4),
       (3, "Lead Engineer", 190000, 1),
       (4, "Software Engineer", 150000, 1),
       (5, "Account Manger", 180000, 2),
       (6, "Accountant", 170000, 2),
       (7, "Legal Team Lead", 250000, 3),
       (8, "Lawyer", 190000, 3),
       (9, "Maketting Lead", 190000, 5),
       (10, "Maketting Manager", 180000, 5);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 1, NULL),
       (2, "Mike", "Chan", 2, 1),
       (3, "Ashley", "Rodriguez", 3, NULL),
       (4, "Kevin", "Tupik", 4, 3),
       (5, "Kunal", "Singh", 5, NULL),
       (6, "Malia", "Brown", 6, 5),
       (7, "Sarah", "Lourd", 7, NULL),
       (8, "Tom", "Allen", 8, 7),
       (9, "Cabel", "Shrestha", 9, NULL),
       (10, "Jane", "Sharma", 10, 9),
       (11, "Jashmin", "Rathor", 2, 1),
       (12, "Maria", "Doe", 2, 1);