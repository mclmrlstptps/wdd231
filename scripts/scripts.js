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
    
    // Selectors
    const courseContainer = document.getElementById('courseContainer');
    const courseDetails = document.querySelector('#course-details');

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
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development.',
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

    // Calculate total credits
    const totalCredits = courses.reduce((total, course) => total + course.credits, 0);
    console.log(`Total Credits Required: ${totalCredits}`);

    // Function to display course details in a modal
    function displayCourseDetails(course) {
        courseDetails.innerHTML = `
            <button id="closeModal">❌</button>
            <h2>${course.subject} ${course.number}</h2>
            <h3>${course.title}</h3>
            <p><strong>Credits</strong>: ${course.credits}</p>
            <p><strong>Certificate</strong>: ${course.certificate}</p>
            <p>${course.description}</p>
            <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
        `;
        courseDetails.showModal();

        document.querySelector('#closeModal').addEventListener('click', () => {
            courseDetails.close();
        });

        courseDetails.addEventListener('click', (event) => {
            if (!courseDetails.contains(event.target.closest('dialog'))) {
                courseDetails.close();
            }
        });
    }

    // Function to display courses
    function displayCourses() {
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

            // Add click event to display course details
            courseElement.addEventListener('click', () => {
                displayCourseDetails(course);
            });
        });
    }

    // Display the courses when the page loads
    displayCourses();
});

// const courseContainer = document.querySelector('#courseContainer')
// const courseDialog = document.querySelector('#mydialog')
// const courseTitle = document.querySelector('#mydialog h2')
// const close = document.querySelector('#mydialog button')

// close.addEventListener("click",()=>courseContainer.close())

// function displayCourseDetails(course) {
//     displayDetails.innerHTML = '';
//     courseDetails.innerHTML = `
//     <button id="closeModal">X</button>
//     <h2>${corse.subject} ${course.number}</h2>
//     <h3>${course.title}</h3> 
//     <p><strong>Credits</strong>: ${course.credits}</p>
//     <p><strong>Certificate</strong>: ${course.certificate}</p>
//     <p>${course.description}</p>
//     <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
//     `;
//     courseDetails.showModal();

//     closeMadal.addEventListener("click", () => {
//         courseDetails.close();
//     });
// }

// courseDiv.addEventListener('click', () => {
//     displayCourseDetails(course);
// });