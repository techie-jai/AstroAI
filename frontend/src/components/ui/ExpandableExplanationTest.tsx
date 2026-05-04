import React from 'react'
import ExpandableExplanation from './ExpandableExplanation'

// Test component to validate ExpandableExplanation functionality
export const ExpandableExplanationTest: React.FC = () => {
  const testShortAnswer = `Based on your kundli, your Sun is placed in the 10th house in Leo sign, which indicates strong leadership qualities and a natural inclination towards career success. This placement often brings recognition and authority in professional life. Your Moon in Cancer suggests emotional sensitivity and nurturing qualities, making you compassionate and intuitive in your approach to life's challenges.`

  const testDetailedAnswer = `Your Sun's placement in the 10th house in Leo is particularly significant as it combines the house of career and public reputation with the sign of leadership and self-expression. This creates a powerful Raj Yoga configuration that often leads to positions of authority and public recognition. The 10th house represents your karma, profession, and how you're perceived by society, while Leo brings creativity, confidence, and a natural ability to lead others.

Looking at the D10 chart (Dasamsa), your Sun maintains a strong position, reinforcing career success potential. The 10th lord in your D1 chart is Mercury, which is placed in the 9th house of fortune and higher learning, indicating that your career path may involve teaching, writing, or communication-related fields. This combination suggests success through intellectual pursuits and the ability to guide others.

Your Moon in Cancer in the 4th house creates a strong connection to home, family, and emotional security. This placement indicates that while you have strong career ambitions, your emotional foundation and family life will be equally important to your overall happiness and success. The Moon's aspect to the 10th house suggests that your emotional intelligence and intuition will be valuable assets in your professional life.

From an Ashtakavarga perspective, your Sun gains 6 bindus in the 10th house, indicating strong career prospects, while your Moon has 7 bindus in the 4th house, suggesting emotional stability and strong family support. These planetary strengths are further enhanced by the fact that both Sun and Moon are in their own signs in the Navamsa chart (D9), indicating that your career success and emotional fulfillment will be well-balanced throughout life.`

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">ExpandableExplanation Test</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Test Case 1: Full Dual-Layer Response</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ExpandableExplanation
              shortAnswer={testShortAnswer}
              detailedAnswer={testDetailedAnswer}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Test Case 2: Short Answer Only</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ExpandableExplanation
              shortAnswer="This is a simple short answer without detailed explanation."
              detailedAnswer=""
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Test Case 3: Empty Detailed Answer</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ExpandableExplanation
              shortAnswer="This response has a short answer but no detailed content."
              detailedAnswer=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpandableExplanationTest
