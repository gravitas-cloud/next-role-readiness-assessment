import { useState } from 'react';
import AssessmentQuestion from '../AssessmentQuestion';

export default function AssessmentQuestionExample() {
  const [selected, setSelected] = useState('3');
  
  return (
    <div className="p-6 bg-background min-h-screen flex items-center">
      <AssessmentQuestion
        question="How often do you participate in strategic planning sessions beyond your technical domain?"
        options={[
          { value: '1', label: 'Rarely or never - I focus primarily on technical execution' },
          { value: '2', label: 'Occasionally when invited to provide technical input' },
          { value: '3', label: 'Regularly - I contribute to strategic discussions' },
          { value: '4', label: 'Frequently - I lead strategic initiatives across functions' },
        ]}
        selectedValue={selected}
        onValueChange={setSelected}
        questionNumber={1}
        totalQuestions={12}
      />
    </div>
  );
}
