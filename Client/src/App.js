import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ResumeTemplate from './ResumeTemplate';

function App() {
    const [formData, setFormData] = useState({
        name: '',
        objective: '',
        experience: [{ organization: '', designation: '', description: '', details: [''] }],
        projects: [{ title: '', synopsis: '', techUsed: '', responsibilities: '' }],
        education: [{ college: '', course: '', from: '', to: '' }],
    });

    const [resumeData, setResumeData] = useState(null);
    const [changesReflected, setChangesReflected] = useState(false);

    useEffect(() => {
        if (resumeData && JSON.stringify(formData) !== JSON.stringify(resumeData)) {
            setChangesReflected(true);
        } else {
            setChangesReflected(false);
        }
    }, [formData, resumeData]);

    const handleChange = (index, e, fieldName, section = null) => {
        const { value } = e.target;
        if (section) {
            const updatedSection = [...formData[section]];
            updatedSection[index][fieldName] = value;
            setFormData({ ...formData, [section]: updatedSection });
        } else {
            setFormData({ ...formData, [fieldName]: value });
        }
    };

    const addArrayField = (section) => {
        const newField = section === 'experience' ? { organization: '', designation: '', description: '', details: [''] }
                      : section === 'projects' ? { title: '', synopsis: '', techUsed: '', responsibilities: '' }
                      : { college: '', course: '', from: '', to: '' };
        setFormData({ ...formData, [section]: [...formData[section], newField] });
    };

    const removeArrayField = (index, section) => {
        const updatedSection = formData[section].filter((_, i) => i !== index);
        setFormData({ ...formData, [section]: updatedSection });
    };

    const handleDetailChange = (expIndex, detailIndex, e) => {
        const { value } = e.target;
        const updatedExperience = [...formData.experience];
        updatedExperience[expIndex].details[detailIndex] = value;
        setFormData({ ...formData, experience: updatedExperience });
    };

    const addDetailField = (expIndex) => {
        const updatedExperience = [...formData.experience];
        updatedExperience[expIndex].details.push('');
        setFormData({ ...formData, experience: updatedExperience });
    };

    const removeDetailField = (expIndex, detailIndex) => {
        const updatedExperience = [...formData.experience];
        updatedExperience[expIndex].details = updatedExperience[expIndex].details.filter((_, i) => i !== detailIndex);
        setFormData({ ...formData, experience: updatedExperience });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/submit-resume', formData);
            setResumeData(response.data.data);
        } catch (error) {
            console.error('Error submitting resume:', error);
        }
    };

    return (
        <div className="App bg-green-700">
            <h1>Resume Builder</h1>
            <form onSubmit={handleSubmit}>
                <div className="section">
                    <h2>Name</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => handleChange(null, e, 'name')}
                    />
                </div>

                <div className="section">
                    <h2>Objective</h2>
                    <textarea
                        name="objective"
                        placeholder="Write your objective"
                        value={formData.objective}
                        onChange={(e) => handleChange(null, e, 'objective')}
                    />
                </div>

                <div className="section">
                    <h2>Professional Experience</h2>
                    {formData.experience.map((exp, index) => (
                        <div key={index} className="experience-entry">
                            <input
                                type="text"
                                name="organization"
                                placeholder="Organization"
                                value={exp.organization}
                                onChange={(e) => handleChange(index, e, 'organization', 'experience')}
                            />
                            <input
                                type="text"
                                name="designation"
                                placeholder="Designation"
                                value={exp.designation}
                                onChange={(e) => handleChange(index, e, 'designation', 'experience')}
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={exp.description}
                                onChange={(e) => handleChange(index, e, 'description', 'experience')}
                            />
                            <button type="button" onClick={() => addDetailField(index)}>Add Detail</button>
                            {exp.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="detail-entry">
                                    <input
                                        type="text"
                                        placeholder="Additional Detail"
                                        value={detail}
                                        onChange={(e) => handleDetailChange(index, detailIndex, e)}
                                    />
                                    <button type="button" onClick={() => removeDetailField(index, detailIndex)}>Remove</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => removeArrayField(index, 'experience')}>Remove Experience</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayField('experience')}>Add Experience</button>
                </div>

                <div className="section">
                    <h2>Projects</h2>
                    {formData.projects.map((project, index) => (
                        <div key={index} className="project-entry">
                            <input
                                type="text"
                                name="title"
                                placeholder="Project Title"
                                value={project.title}
                                onChange={(e) => handleChange(index, e, 'title', 'projects')}
                            />
                            <textarea
                                name="synopsis"
                                placeholder="Project Synopsis"
                                value={project.synopsis}
                                onChange={(e) => handleChange(index, e, 'synopsis', 'projects')}
                            />
                            <input
                                type="text"
                                name="techUsed"
                                placeholder="Technologies Used"
                                value={project.techUsed}
                                onChange={(e) => handleChange(index, e, 'techUsed', 'projects')}
                            />
                            <textarea
                                name="responsibilities"
                                placeholder="Responsibilities"
                                value={project.responsibilities}
                                onChange={(e) => handleChange(index, e, 'responsibilities', 'projects')}
                            />
                            <button type="button" onClick={() => removeArrayField(index, 'projects')}>Remove Project</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayField('projects')}>Add Project</button>
                </div>

                <div className="section">
                    <h2>Education</h2>
                    {formData.education.map((edu, index) => (
                        <div key={index} className="education-entry">
                            <input
                                type="text"
                                name="college"
                                placeholder="College Name"
                                value={edu.college}
                                onChange={(e) => handleChange(index, e, 'college', 'education')}
                            />
                            <input
                                type="text"
                                name="course"
                                placeholder="Course"
                                value={edu.course}
                                onChange={(e) => handleChange(index, e, 'course', 'education')}
                            />
                            <input
                                type="text"
                                name="from"
                                placeholder="From"
                                value={edu.from}
                                onChange={(e) => handleChange(index, e, 'from', 'education')}
                            />
                            <input
                                type="text"
                                name="to"
                                placeholder="To"
                                value={edu.to}
                                onChange={(e) => handleChange(index, e, 'to', 'education')}
                            />
                            <button type="button" onClick={() => removeArrayField(index, 'education')}>Remove Education</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayField('education')}>Add Education</button>
                </div>

                <div className="button-group">
                    <button type="submit" className="custom-button">Generate Resume</button>

                    <button type="button" className="custom-button ml-2">
                        {changesReflected ? 'Do again Genrate Resume' : 'No Changes'}
                    </button>
                </div>
            </form>

            {resumeData && <ResumeTemplate resumeData={resumeData} />}
        </div>
    );
}

export default App;
