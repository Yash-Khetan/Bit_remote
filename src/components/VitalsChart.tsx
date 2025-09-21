import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { VitalReading } from '../types';
import { useTranslation } from 'react-i18next';

interface VitalsChartProps {
  data: VitalReading[];
  type: 'blood_sugar' | 'blood_pressure' | 'weight';
  period: 'week' | 'month';
}

const VitalsChart: React.FC<VitalsChartProps> = ({ data, type, period }) => {
  const { t } = useTranslation();

  // Filter and prepare data based on type and period
  const filteredData = data
    .filter(reading => reading.type === type)
    .filter(reading => {
      const now = new Date();
      const readingDate = new Date(reading.timestamp);
      const daysDiff = (now.getTime() - readingDate.getTime()) / (1000 * 3600 * 24);
      return period === 'week' ? daysDiff <= 7 : daysDiff <= 30;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(reading => ({
      date: new Date(reading.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      value: reading.value,
      systolic: reading.systolic,
      diastolic: reading.diastolic,
      unit: reading.unit
    }));

  if (filteredData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">No data available for the selected period</p>
      </div>
    );
  }

  const getChartColor = () => {
    switch (type) {
      case 'blood_sugar': return '#ef4444';
      case 'blood_pressure': return '#3b82f6';
      case 'weight': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any, name: string) => {
                if (type === 'blood_pressure') {
                  return [`${value} ${filteredData[0]?.unit}`, name === 'systolic' ? 'Systolic' : 'Diastolic'];
                }
                return [`${value} ${filteredData[0]?.unit}`, t(`vitals.${type}`)];
              }}
            />
            
            {type === 'blood_pressure' ? (
              <>
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke={getChartColor()}
                  strokeWidth={2}
                  dot={{ fill: getChartColor(), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Legend />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke={getChartColor()}
                strokeWidth={2}
                dot={{ fill: getChartColor(), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VitalsChart;