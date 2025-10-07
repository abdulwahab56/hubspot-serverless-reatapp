import React from "react";

const Home = () => {
  return (
    <div className="pt-6 px-6 md:px-16 lg:px-32 bg-gray-50 min-h-screen">
      {/* Release Notes Section */}
      <main className="release-notes">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Release Notes - Version 3.10
        </h1>
        <h3 className="text-gray-600 mb-8">Release Date: 11/11/2024</h3>

        {/* What's New */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            What's New?
          </h2>

          <article className="bg-white rounded-xl shadow-sm px-6 py-2 mb-4 border-l-4 border-indigo-500">
            <h4 className="text-lg font-semibold mb-2 text-gray-600 uppercase">Added SMS Support</h4>
            <p className="text-gray-700 leading-relaxed">
              Introduced support for SMS to broaden communication channels and
              improve user accessibility.{" "}
              <strong>(Subject to License)</strong>
            </p>
          </article>

          <article className="bg-white rounded-xl shadow-sm p-6 mb-4 border-l-4 border-indigo-500">
            <h4 className="text-lg font-semibold mb-2 text-gray-600 uppercase">
              Added Email Field in Contact List in Multi-match Case
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Added an email field in the contact list in multi-match scenarios,
              enhancing the flexibility of communication.
            </p>
          </article>

          <article className="bg-white rounded-xl shadow-sm p-6 mb-4 border-l-4 border-indigo-500">
            <h4 className="text-lg font-semibold mb-2 text-gray-600 uppercase">
              Added Call Attributes Support
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Now supports call attributes for better decision-making based on
              call flow data. Call attributes can be added to the configuration
              and viewed in HubSpot record descriptions.
            </p>
          </article>
        </section>

        {/* Bug Fixes Section */}
        <section>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            Bug Fixes and Improvements
          </h2>

          <article className="bg-white rounded-xl shadow-sm p-6 mb-4 border-l-4 border-green-500">
            <h4 className="text-lg font-semibold mb-2 text-gray-600 uppercase">
              Fixed ECR Vulnerabilities
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Resolved identified security vulnerabilities in the ECS
              environment to enhance system security and integrity.
            </p>
          </article>

          <article className="bg-white rounded-xl shadow-sm p-6 mb-4 border-l-4 border-green-500">
            <h4 className="text-lg font-semibold mb-2 text-gray-600 uppercase">
              S3 Recording Issue Fixed
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Addressed and resolved an issue with S3 recording to ensure
              consistent and reliable storage of recorded data.
            </p>
          </article>

          <article className="bg-white rounded-xl shadow-sm p-6 mb-4 border-l-4 border-green-500">
            <h4 className="text-lg font-semibold mb-2 text-gray-600 uppercase">
              Database Configuration for High Availability
            </h4>
            <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
              <li>
                If the connector is deployed on a single instance, it will use
                the local database (LowDB).
              </li>
              <li>
                If deployed on 2 or more instances or ECS, the system will use
                DynamoDB for database scalability and availability.
              </li>
            </ul>
          </article>

          <article className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <h4 className="text-lg font-semibold mb-2 text-gray-600 uppercase">
              Enhanced API Security
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Improved API security by implementing authorization mechanisms to
              ensure secure communication and data protection.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Home;
