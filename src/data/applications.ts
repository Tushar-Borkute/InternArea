export interface Application {
    id: number;
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    college: string;
    degree: string;
    cgpa: string;
    skills: string[];
    experience: string;
    appliedDate: string;
    status: string;
}

export const applications: Application[] = [
    {
        id: 1,
        name: "Rahul Sharma",
        email: "rahul.sharma@gmail.com",
        phone: "9876543210",
        jobTitle: "Frontend Developer Intern",
        college: "Government College of Engineering, Chandrapur",
        degree: "B.Tech Computer Science",
        cgpa: "8.7",
        skills: ["React", "JavaScript", "HTML", "CSS"],
        experience: "Fresher",
        appliedDate: "14 July 2026",
        status: "Pending",
    },
    {
        id: 2,
        name: "Priya Verma",
        email: "priya.verma@gmail.com",
        phone: "9123456780",
        jobTitle: "Backend Developer Intern",
        college: "VNIT Nagpur",
        degree: "B.Tech Information Technology",
        cgpa: "9.1",
        skills: ["Python", "Flask", "MySQL"],
        experience: "6 Months",
        appliedDate: "13 July 2026",
        status: "Shortlisted",
    },
    {
        id: 3,
        name: "Amit Patil",
        email: "amit.patil@gmail.com",
        phone: "9988776655",
        jobTitle: "UI/UX Designer",
        college: "Pune Institute of Computer Technology",
        degree: "B.Des",
        cgpa: "8.9",
        skills: ["Figma", "Adobe XD", "Photoshop"],
        experience: "1 Year",
        appliedDate: "12 July 2026",
        status: "Rejected",
    },
    {
        id: 4,
        name: "Sneha Joshi",
        email: "sneha.joshi@gmail.com",
        phone: "9012345678",
        jobTitle: "Full Stack Developer",
        college: "COEP Pune",
        degree: "B.Tech Computer Engineering",
        cgpa: "9.3",
        skills: ["React", "Node.js", "MongoDB", "Express"],
        experience: "Fresher",
        appliedDate: "11 July 2026",
        status: "Pending",
    },
    {
        id: 5,
        name: "Rohan Kulkarni",
        email: "rohan.kulkarni@gmail.com",
        phone: "9870011223",
        jobTitle: "Data Analyst Intern",
        college: "IIT Bombay",
        degree: "B.Tech Data Science",
        cgpa: "9.0",
        skills: ["Python", "SQL", "Power BI", "Excel"],
        experience: "3 Months",
        appliedDate: "10 July 2026",
        status: "Interview Scheduled",
    },
];
