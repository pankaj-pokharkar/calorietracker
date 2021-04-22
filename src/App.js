import React, {useState, useEffect} from 'react';
import './App.css';

const App = () => {
  const [totalCalConsumed, setTotalCalConsumed] = useState(0);
  const [breakfastMeal, setBreakfastMeal] = useState([]);
  const [morningSnackMeal, setMorningSnackMeal] = useState([]);
  const [lunchMeal, setLunchMeal] = useState([]);
  const [eveningSnackMeal, setEveningSnackMeal] = useState([]);
  const [dinnerMeal, setDinnerMeal] = useState([]);
  const [mealCalConsumed, setMealCalConsumed] = useState({
    breakfast: 0,
    morning_snack: 0,
    lunch: 0,
    evening_snack: 0,
    dinner: 0
  });

  const delEntry = (mealName, mealCal, type='breakfast') => {
    fetch('/tracker?user_id=499105', {
      method: 'POST',

      body: JSON.stringify({
        meal: {name: mealName, cal: mealCal},
        mealType: type
      }),

      headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));

    let mealList = [];
    let setMealList = null;
    let calConsumed = mealCalConsumed[type];
    let mealCalDiff = 0;
    if (type === 'breakfast') {
      mealList = [ ...breakfastMeal];
      setMealList = setBreakfastMeal;
      mealCalDiff = breakfast_cal_limit - mealCalConsumed.breakfast;
    } else if (type === 'morning_snack') {
      mealList = [ ...morningSnackMeal];
      setMealList = setMorningSnackMeal;
      mealCalDiff = morning_snack_cal_limit - mealCalConsumed.morning_snack;
    } else if (type === 'lunch') {
      mealList = [ ...lunchMeal];
      setMealList = setLunchMeal;
      mealCalDiff = lunch_cal_limit - mealCalConsumed.lunch;
    } else if (type === 'evening_snack') {
      mealList = [ ...eveningSnackMeal];
      setMealList = setEveningSnackMeal;
      mealCalDiff = evening_snack_cal_limit - mealCalConsumed.evening_snack;
    } else {
      mealList = [ ...dinnerMeal];
      setMealList = setDinnerMeal;
      mealCalDiff = dinner_cal_limit - mealCalConsumed.dinner;
    }
    calConsumed += parseInt(mealCal);
    
    let objectIndex = mealList.findIndex(item => item.name === mealName);
    mealList.splice(objectIndex, 1);

    // After removing selected entry, remove items for which diff is ledd tahn calorie value
    mealCalDiff -= calConsumed;
    let filteredList = mealList.filter(obj =>parseInt(obj.cal) <= mealCalDiff);

    let totalCal = totalCalConsumed;
    setTotalCalConsumed( totalCal += parseInt(mealCal));
    setMealCalConsumed({ ...mealCalConsumed, [type]: calConsumed });
    setMealList([...filteredList]);
  };

  const breakfast_cal_limit = 498;
  const morning_snack_cal_limit = 187;
  const lunch_cal_limit = 498;
  const evening_snack_cal_limit = 187;
  const dinner_cal_limit = 498;

  useEffect(() => {
    fetch('/meals?user_id=499105')
    .then(res => res.json())
    .then(data => 
      {
        const mealItems = ['Dosa', 'Chicken Curry', 'Moong Dal'];
        const filteredSnacks = data.filter(item => !mealItems.includes(item.name));
        setBreakfastMeal([...data]);
        setMorningSnackMeal([...filteredSnacks]);
        setLunchMeal([...data]);
        setEveningSnackMeal([...filteredSnacks]);
        setDinnerMeal([...data]);
      })
    .catch(err => console.log(err));
  }, [])

  const ListItem = ({ label, calorie, type }) => (
    <li data-testid={`meal_${type}_${label.replace(/\s+/g, '').toLowerCase()}_${calorie}`} onClick={() => delEntry(label, calorie, type)}>{label} [{calorie} Cal]</li>
  );
  return (
    <div>
      <div className="header">
        <h1>My Daily Calorie Tracker</h1>
        <h1 data-testid="final_calorie_consumed_message">I, Consumed {totalCalConsumed}/1868 Cal Today</h1>
      </div>
      <div className="meal-container">
        <div className="meal-type">
          <h1>Breakfast ({mealCalConsumed.breakfast}/{breakfast_cal_limit} Cal)</h1>
          <ul>
            {breakfastMeal && breakfastMeal.map(item => 
              <ListItem label={item.name} calorie={item.cal} type="breakfast" key={`breakFast-${item.name}`} />
            )}
          </ul>
        
        </div>
        <div className="meal-type">
          <h1>Morning Snack ({mealCalConsumed.morning_snack}/{morning_snack_cal_limit} Cal)</h1>
          <ul>
            {morningSnackMeal && morningSnackMeal.map(item => 
              <ListItem label={item.name} calorie={item.cal} type="morning_snack" key={`morning_snack-${item.name}`} />
            )}
          </ul>
          
        </div>
        <div className="meal-type">
          <h1>Lunch ({mealCalConsumed.lunch}/{lunch_cal_limit} Cal)</h1>
          <ul>
            {lunchMeal && lunchMeal.map(item => 
              <ListItem label={item.name} calorie={item.cal} type="lunch" key={`lunch-${item.name}`} />
            )}
          </ul>
          
        </div>
        <div className="meal-type">
          <h1>Evening Snacks ({mealCalConsumed.evening_snack}/{evening_snack_cal_limit} Cal)</h1>
          <ul>
            {eveningSnackMeal && eveningSnackMeal.map(item => 
              <ListItem label={item.name} calorie={item.cal} type="evening_snack" key={`evening_snack-${item.name}`} />
            )}
          </ul>
          
        </div>
        <div className="meal-type">
          <h1>Dinner ({mealCalConsumed.dinner}/{dinner_cal_limit} Cal)</h1>
          <ul>
            {dinnerMeal && dinnerMeal.map(item => 
              <ListItem label={item.name} calorie={item.cal} type="dinner" key={`dinner-${item.name}`} />
            )}
          </ul>
          
        </div>
      </div>
    </div>
  );
}

export default App;
