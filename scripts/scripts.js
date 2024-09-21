

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.hamburger.menu');
    const navMenu = document.querySelector('nav ul');
  

    if (menuToggle && navMenu) {  // Ensure both elements exist
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('show');
      });
    });
  
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);
      if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
      }
    });
           // Array of courses
    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming.',
            technology: ['HTML', 'CSS'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'Students learn to write and call functions to solve problems in many disciplines, including business, physical science, and more.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces the concept of classes and objects, along with inheritance and polymorphism.',
            technology: ['C#'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'Students will learn to create dynamic websites using JavaScript to respond to events and update content.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'Students focus on user experience, accessibility, compliance, performance optimization, and API usage.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        }
    ];

    const totalCredits = courses.reduce((total, course) => total + course.credits, 0);
    console.log(`Total Credits Required: ${totalCredits}`);

    // Function to display courses
    function displayCourses() {
        const courseContainer = document.getElementById('courseContainer');
        if (!courseContainer) return;

        // Clear the course container
        courseContainer.innerHTML = '';

        courses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.classList.add('course');
            if (course.completed) {
                courseElement.classList.add('completed');
            }
            
            // Display the course subject, number, and title
            courseElement.innerHTML = `
                <span class="course-code">${course.subject} ${course.number}</span>

            `;
            courseContainer.appendChild(courseElement);
        });
    }

    // Display the courses when the page loads
    displayCourses();
});
