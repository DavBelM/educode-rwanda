import LegalLayout, { type LegalSection } from './LegalLayout';

const sections: LegalSection[] = [
  {
    id: 'section-10',
    heading: '10. Our commitment and the law that applies',
    content: (
      <>
        <p style={{ marginBottom: 16 }}>
          This policy explains what the platform collects, why, where it goes, how long it is kept,
          and what rights the user has. It is written to meet the requirements of Law No. 058/2021
          of 13/10/2021 relating to the protection of personal data and privacy (Republic of Rwanda,
          2021), and it reflects the principles of the Rwanda National AI Policy (Government of
          Rwanda, 2023) and the UNESCO Recommendation on the Ethics of Artificial Intelligence
          (UNESCO, 2021).
        </p>
        <p>
          This research received ethical clearance from the African Leadership University Research
          Ethics Committee, dated 18 June 2026. Institutional permission for school deployment was
          obtained from the Director of Studies at the participating school.
        </p>
      </>
    ),
  },
  {
    id: 'section-11',
    heading: '11. What the platform collects',
    content: (
      <>
        <ul className="plain-list" style={{ marginBottom: 20 }}>
          <li>
            <strong>Account information:</strong> name, email address, the school the user belongs
            to, and the user&rsquo;s role (student, self-learner, teacher, or school administrator).
          </li>
          <li>
            <strong>Learning activity:</strong> code submitted in the workspace, error messages
            produced by that code, assignment submissions, coding-challenge attempts and outcomes,
            lesson and quiz progress, experience points, content ratings, and login dates.
          </li>
          <li>
            <strong>Tutor interactions:</strong> the question or code sent to the Mwarimu tutor,
            the feedback returned, the language used, the response latency, and any rating the user
            gives that feedback.
          </li>
          <li>
            <strong>Assessment integrity events, during timed assessments only:</strong> tab
            switches, loss of window focus, exits from fullscreen, and paste events.
          </li>
          <li>
            <strong>Survey responses,</strong> where the user chooses to complete the in-platform
            feedback survey.
          </li>
        </ul>
        <p>
          The platform does not collect national identity numbers, telephone numbers, home addresses,
          photographs, biometric data, or any special category of sensitive personal data. Research
          survey responses collected for the study do not carry names; only the school and an age
          range are recorded, so that a respondent cannot be re-identified from survey data.
        </p>
      </>
    ),
  },
  {
    id: 'section-12',
    heading: '12. Why the platform collects it',
    content: (
      <>
        <p style={{ marginBottom: 16 }}>
          Account information is used to authenticate the user and to place them in the correct
          class and school. Learning activity is used to give the user feedback, to track their
          progress, and to let their teacher see where they are struggling so that teaching time can
          be directed where it is most needed. Tutor interactions are used to produce the feedback
          itself and, in anonymised form, to study which errors Rwandan TVET learners make most
          often and to improve the model. Assessment integrity events are used to make timed
          assessments fair. Survey responses are used to evaluate whether the platform works.
        </p>
        <p>
          The lawful basis for processing is the consent of the user, given at registration and, for
          learners below the age of majority, arranged through the school as institutional
          gatekeeper, together with the ethical clearance obtained before any data collection began.
        </p>
      </>
    ),
  },
  {
    id: 'section-13',
    heading: '13. Automated processing and the logic involved',
    content: (
      <>
        <p style={{ marginBottom: 16 }}>
          Law No. 058/2021 requires that a data subject be told when automated decision-making is
          used and be given information about the logic involved. The platform therefore discloses
          the following.
        </p>
        <p>
          When a user asks the tutor for help, the question and the surrounding code are first used
          to search a curriculum knowledge base, so that the answer is grounded in the material the
          learner is actually studying. The question, together with the retrieved curriculum
          material, is then sent to a language model that has been fine-tuned on JavaScript error
          corrections, and that model produces a hint. If that model is unavailable, a
          general-purpose model produces the hint instead. If neither is available, a simple
          rule-based matcher recognises the error type and returns a standard explanation.
          This process produces guidance only. It does not score the user, does not rank the user
          against other users, and does not make any decision that affects the user&rsquo;s grades
          or progression. Grading is performed by the teacher.
        </p>
      </>
    ),
  },
  {
    id: 'section-14',
    heading: '14. Who else processes the data, and where',
    content: (
      <>
        <p style={{ marginBottom: 16 }}>
          The platform is built on third-party services, and data is processed by them on the
          developer&rsquo;s behalf:
        </p>
        <ul className="plain-list" style={{ marginBottom: 16 }}>
          <li>
            <strong>Supabase,</strong> which provides the database, user authentication, and the
            search index used to ground tutor answers.
          </li>
          <li>
            <strong>Vercel,</strong> which hosts the application and runs the function that
            orchestrates tutor requests.
          </li>
          <li>
            <strong>Hugging Face,</strong> which hosts the fine-tuned model that generates feedback.
          </li>
          <li>
            <strong>Google,</strong> whose Gemini service provides the search embeddings, the
            Kinyarwanda translation, and the fallback model when the primary model is unavailable.
          </li>
        </ul>
        <p>
          These services operate servers outside Rwanda. This means that when a user asks the tutor
          for help, the code and error message they send are transmitted outside the country for
          processing. Users should therefore not enter personal information about themselves or
          anyone else into the code editor or the tutor. Data is not sold, and it is not shared with
          advertisers.
        </p>
      </>
    ),
  },
  {
    id: 'section-15',
    heading: '15. Who can see the data inside the platform',
    content: (
      <p>
        Access is restricted by role, and enforced in the database itself through row-level
        security. A student sees only their own work. A teacher sees the work, progress, and error
        patterns of the students in their own classes. A school administrator sees the teachers and
        students of their own school. The developer can access data for the purpose of operating
        the platform and conducting the research described here. No other party has access.
      </p>
    ),
  },
  {
    id: 'section-16',
    heading: '16. How long the data is kept',
    content: (
      <p>
        Account data and learning activity are kept for as long as the account is active. Where a
        school pilot has ended, identifiable pilot data is retained for no longer than twelve months
        from the end of the pilot, after which it is either deleted or irreversibly anonymised so
        that it can no longer be linked to an individual. Anonymised and aggregated records, which
        cannot be traced back to a person, may be kept indefinitely for research into learner error
        patterns and for improving the model. Assessment integrity events are kept only as long as
        the associated assessment record.
      </p>
    ),
  },
  {
    id: 'section-17',
    heading: '17. How the data is protected',
    content: (
      <p>
        Access to the platform requires authentication. Records are separated by user through
        row-level security policies enforced in the database, so that one user cannot read another
        user&rsquo;s records. Credentials for the third-party services are held on the server side
        and are not exposed to the browser. Data is transmitted over encrypted connections.
      </p>
    ),
  },
  {
    id: 'section-18',
    heading: '18. The rights of the user',
    content: (
      <>
        <p style={{ marginBottom: 16 }}>
          Under Law No. 058/2021 the user has the right to be informed about how their data is
          processed, to access their data, to have inaccurate data corrected, to have their data
          erased, to withdraw consent at any time without that withdrawal affecting processing
          already carried out lawfully, and to object to processing.
        </p>
        <p>
          A user may exercise these rights by contacting the developer at{' '}
          <a href="mailto:belamitali@gmail.com">belamitali@gmail.com</a>. Where the user is a
          student below the age of majority, a request may be made directly by the student or
          through their teacher or school, and the school is informed so that the student&rsquo;s
          participation in class is not disrupted. Requests are answered within thirty days.
        </p>
      </>
    ),
  },
  {
    id: 'section-19',
    heading: '19. Children and young learners',
    content: (
      <p>
        The platform is used by secondary school students, many of whom are below the age of
        majority. Participation is arranged through the school, which acts as the institutional
        gatekeeper, and ethical clearance for the research was obtained before any data was
        collected. Data collection is kept to the minimum needed for the platform to work: research
        survey responses carry no names, and no sensitive personal data is collected. Monitoring
        during assessment is disclosed to students in advance, is limited to timed assessments, and
        is not used to observe learners outside those assessments.
      </p>
    ),
  },
  {
    id: 'section-20',
    heading: '20. Contact',
    content: (
      <p>
        Questions about this policy, or requests concerning personal data, may be sent to Mitali
        Bela at{' '}
        <a href="mailto:belamitali@gmail.com">belamitali@gmail.com</a>. The supervisory authority
        for data protection in Rwanda is the National Cyber Security Authority, to which a complaint
        may be made.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      pageTitle="Privacy Policy · EduCode Rwanda"
      eyebrow="Legal"
      title="Privacy Policy"
      lede="This policy explains how EduCode Rwanda collects, uses, protects, and retains your personal data, and what rights you have under Rwandan law."
      version="Version 1.0"
      effective="1 June 2026"
      lastReviewed="19 July 2026"
      sections={sections}
      crossLink={{ label: 'End-User Licence Agreement (Part A →)', to: '/terms' }}
    />
  );
}
