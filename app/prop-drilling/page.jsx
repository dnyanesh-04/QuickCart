'use client';
import React from 'react';

// Top-level Page Component
const TestPropDrilling = () => {
  const message = "Prop drilling is working";

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Testing Prop Drilling</h1>
      <ParentComponent message={message} />
    </div>
  );
};

// First layer 
const ParentComponent = ({ message }) => {
  return <ChildComponent message={message} />;
};

// Second layer 
const ChildComponent = ({ message }) => {
  return <NestedChildComponent message={message} />;
};

// Final component that actually uses the prop
const NestedChildComponent = ({ message }) => {
  return (
    <div className="p-4 bg-orange-100 border rounded">
      <p className="text-gray-700">{message}</p>
    </div>
  );
};

export default TestPropDrilling;

// 'use client';
// import React from 'react';

// const TestPropDrilling = () => {
//   const message = "Directly rendering";

//   return (
//     <div className="p-10">
//       <h1 className="text-2xl font-bold mb-4">Testing Without Prop Drilling</h1>
//       <DirectMessage message={message} />
//     </div>
//   );
// };

// // Directly receiving and using the prop
// const DirectMessage = ({ message }) => {
//   return (
//     <div className="p-4 bg-orange-100 border rounded">
//       <p className="text-gray-700">{message}</p>
//     </div>
//   );
// };

// export default TestPropDrilling;
