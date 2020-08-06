import React, { useState } from 'react';

function FaqPage() {
  const [faqs, setfaqs] = useState([
    {
      question: 'How can I create an account?',
      answer: 'Click create account on the homepage. Fill in all the required information and submit. You can then login through the homepage using your email and password.',
      open: false,
    },
    {
      question: 'Where can I create a group?',
      answer: 'Once you are logged in, you can click create group button on the user dashboard, fill in all the required information and submit. By default you will be the admin of the group',
      open: false,
    },
    {
      question: 'Why cant I create an event?',
      answer: 'Only if you are an admin of a group(you created the group), you can go to that particular group and click on create event button, fill in the required information and click submit',
      open: false,
    },
    {
      question: 'How do I join a group or event?',
      answer: 'Simply go to the particular group or event and click on the join group/event button. Note: You can only join an event if you are a member of that group',
      open: false,
    },
    {
      question: 'How can I find a particular group/event if I dont remember its name? ',
      answer: 'You can use the search bar on the user dashboard to search for groups/events. Even if you dont remember the name of the group/event, you can search it using the related interest.',
      open: false,
    },
    {
      question: 'What if I accidently join a group/event?',
      answer: 'You can leave a group/event anytime using the leave group/event button on that particular group/event page',
      open: false,
    },
  ]);

  const toggleFAQ = (index) => {
    setfaqs(faqs.map((faq, i) => {
      if (i === index) {
        faq.open = !faq.open;
      } else {
        faq.open = false;
      }

      return faq;
    }));
  };


  return (
    <div>
      <h1 style={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>FAQ page</h1>
      <div className="faqs">
        {faqs.map((faq, i) => (
          <FAQ key={i} faq={faq} index={i} toggleFAQ={toggleFAQ} />
        ))}
      </div>
    </div>
  );
}

function FAQ({ faq, index, toggleFAQ }) {
  return (
    <div
      className={`faq ${faq.open ? 'open' : ''}`}
      onClick={() => toggleFAQ(index)}
    >
      <div className="faq-question">
        {faq.question}
      </div>
      <div className="faq-answer">
        {faq.answer}
      </div>
    </div>
  );
}

export default FaqPage;
