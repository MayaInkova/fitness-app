import React from 'react';

function PlanPage({ plan }) {
  if (!plan) return null;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📄 Детайли на хранителния режим</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(plan, null, 2)}</pre>
    </div>
  );
}

export default PlanPage;
