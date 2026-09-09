import React from 'react'

// Helper: safely render items that may be strings OR {question, answer} objects
const renderSafe = (item) => {
  if (typeof item === 'string' || typeof item === 'number') return item;
  if (typeof item === 'object' && item !== null) {
    return item.question || item.q || item.name || JSON.stringify(item);
  }
  return String(item || '');
};

function Sidebar({ result }) {
  if (
    !result || 
    !result.subTopics || 
    !result.questions || 
    !result.questions.short || 
    !result.questions.long
  ) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
      
      {/* 📌 Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">📌</span>
        <h3 className='text-lg font-semibold text-indigo-600'>Quick Exam View</h3>
      </div>

      {/* ⭐ Sub Topics Section */}
      <section>
        <p className='text-sm font-semibold text-gray-700 mb-3'>
          ⭐ Sub Topics (Priority Wise)
        </p>

        {Object.entries(result.subTopics).map(([star, topics]) => (
          <div key={star} className='mb-3 rounded-lg bg-gray-50 border border-gray-200 p-3'>
            <p className='text-sm font-semibold text-yellow-600 mb-1'>
              {star} Priority
            </p>

            <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
              {Array.isArray(topics) && topics.map((t, i) => (
                <li key={i}>{renderSafe(t)}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* 🔥 Exam Importance & Important Questions (ALL INSIDE YELLOW BOX) */}
      <section className='rounded-xl bg-yellow-50/60 border border-yellow-200/80 p-4 space-y-4'>
        
        {/* Exam Importance Stars */}
        <div>
          <p className='text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1'>
            🔥 Exam Importance
          </p>
          <span className='text-yellow-600 font-bold text-sm'>
            {result.importance}
          </span>
        </div>

        {/* ❓ Important Questions Header */}
        <p className='text-sm font-semibold text-gray-800 flex items-center gap-1 pt-1'>
          ❓ Important Questions
        </p>

        {/* 1️⃣ Short Questions Box */}
        <div className='rounded-lg bg-indigo-50/70 border border-indigo-200/60 p-3'>
          <p className='text-sm font-medium text-indigo-700 mb-2'>
            Short Questions
          </p>
          <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
            {Array.isArray(result.questions.short) && result.questions.short.map((t, i) => (
              <li key={i}>{renderSafe(t)}</li>
            ))}
          </ul>
        </div>

        {/* 2️⃣ Long Questions Box */}
        <div className='rounded-lg bg-purple-50/70 border border-purple-200/60 p-3'>
          <p className='text-sm font-medium text-purple-700 mb-2'>
            Long Questions
          </p>
          <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
            {Array.isArray(result.questions.long) && result.questions.long.map((t, i) => (
              <li key={i}>{renderSafe(t)}</li>
            ))}
          </ul>
        </div>

        {/* 3️⃣ Diagram Questions Box */}
        {result.questions.diagram && (typeof result.questions.diagram === 'string' ? result.questions.diagram.trim() !== "" : true) && (
          <div className='rounded-lg bg-blue-50/70 border border-blue-200/60 p-3'>
            <p className='text-sm font-medium text-blue-700 mb-2'>
              Diagram Questions
            </p>
            <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
              <li>{renderSafe(result.questions.diagram)}</li>
            </ul>
          </div>
        )}

      </section>

    </div>
  )
}

export default Sidebar