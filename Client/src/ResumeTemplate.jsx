import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeTemplate = ({ resumeData = {} }) => {
  const resumeRef = useRef(null);

  const generatePDF = () => {
    if (!resumeRef.current) return;

    const button = document.getElementById('download-btn');
    if (button) button.style.display = 'none'; // Hide the button

    html2canvas(resumeRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('resume.pdf');

      // Show the button again
      if (button) button.style.display = 'block';
    });
  };

  const {
    name = '',
    objective = '',
    experience = [],
    projects = [],
    education = []
  } = resumeData;

  return (
    <div>
      <div id="resume-template" ref={resumeRef} className="p-5 bg-slate-200 shadow-lg rounded-sm border-t-4 border-blue-950 mt-10">
        <div className="border-b-2 border-dark-blue pb-2 mb-5 flex justify-between  ">
          <p className="text-3xl font-semibold text-dark-blue mb-4 text-center mt-24 bg-transparent">{name}</p>
          <img src='/adixo.jpg' width="160px " height="200px" className=' mix-blend-color-burn bg-transparent'/>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold underline">OBJECTIVE :</p>
          <hr className="my-2 border-dark-blue" />
          <p>{objective}</p>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold underline">PROFESSIONAL EXPERIENCE :</p>
          <hr className="my-2 border-dark-blue" />
          <ul className="list-disc pl-5">
            {experience.map((exp, index) => (
              <li key={index} className="mb-4">
                <p className="font-semibold">{exp.organization}</p>
                <p>{exp.designation}</p>
                <p>{exp.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold">PROJECTS</p>
          <hr className="my-2 border-dark-blue" />
          <ul className="list-disc pl-5">
            {projects.map((project, index) => (
              <li key={index} className="mb-4">
                <p><strong>PROJECT TITLE:</strong> {project.title}</p>
                <p><strong>PROJECT SYNOPSIS:</strong> {project.synopsis}</p>
                <p><strong>TECHNOLOGIES USED:</strong> {project.techUsed}</p>
                <p><strong>RESPONSIBILITIES:</strong> {project.responsibilities}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold">EDUCATION</p>
          <hr className="my-2 border-dark-blue" />
          <ul className="list-disc pl-5">
            {education.map((edu, index) => (
              <li key={index} className="mb-4 flex px-2">
                <p className="font-semibold mr-3">{edu.college}</p>
                <p>{edu.course}</p>
                <p><strong>From:</strong> {edu.from} <strong>To:</strong> {edu.to}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button id="download-btn" onClick={generatePDF} className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700">
          Download Resume
        </button>
      </div>
    </div>
  );
};

export default ResumeTemplate;
