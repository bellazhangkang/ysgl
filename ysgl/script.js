// script.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate-btn').addEventListener('click', function() {
        const age = parseFloat(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value) / 100; // 转换为米
        const gender = document.getElementById('gender').value;
        const dietLevel = document.getElementById('diet-level').value;
        
        if (!age || !weight || !height) {
            alert('请填写所有必需信息');
            return;
        }
        
        if (age < 18 || age > 80) {
            alert('年龄必须在18-80岁之间');
            return;
        }
        
        if (weight < 30 || weight > 200) {
            alert('体重必须在30-200kg之间');
            return;
        }
        
        if (height < 1.4 || height > 2.2) {
            alert('身高必须在140-220cm之间');
            return;
        }
        
        // 计算BMI
        const bmi = weight / (height * height);
        
        // 计算体脂率 (使用简化的公式)
        let bodyFat;
        if (gender === 'male') {
            bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
        } else {
            bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
        }
        
        // 确保体脂率在合理范围内
        bodyFat = Math.max(10, Math.min(40, bodyFat));
        
        // 确定体脂率范围
        let bodyFatRange;
        if (bodyFat >= 25) {
            bodyFatRange = "25%~30%";
        } else if (bodyFat >= 23) {
            bodyFatRange = "23%~25%";
        } else if (bodyFat >= 20) {
            bodyFatRange = "20%~23%";
        } else {
            bodyFatRange = "15%~20%";
        }
        
        // 显示身体数据
        document.getElementById('bmi-value').textContent = bmi.toFixed(1);
        document.getElementById('body-fat-value').textContent = bodyFat.toFixed(1) + "%";
        document.getElementById('body-fat-range').textContent = bodyFatRange;
        
        // 获取营养素比例
        const ratios = getNutrientRatios(dietLevel, bodyFatRange, gender);
        
        // 计算各餐营养素需求
        const breakfast = {
            carb: Math.round(weight * ratios.breakfast.carb),
            protein: Math.round(weight * ratios.breakfast.protein),
            fat: Math.round(weight * ratios.breakfast.fat)
        };
        
        const lunch = {
            carb: Math.round(weight * ratios.lunch.carb),
            protein: Math.round(weight * ratios.lunch.protein),
            fat: Math.round(weight * ratios.lunch.fat)
        };
        
        const dinner = {
            carb: Math.round(weight * ratios.dinner.carb),
            protein: Math.round(weight * ratios.dinner.protein),
            fat: Math.round(weight * ratios.dinner.fat)
        };
        
        // 显示结果
        displayResults(breakfast, lunch, dinner, dietLevel, bodyFatRange, gender);
        document.getElementById('results-section').style.display = 'block';
        
        // 显示当前使用的比例
        const dietLevelText = {
            low: "低碳",
            medium: "中碳",
            high: "高碳"
        };
        document.getElementById('ratio-display').textContent = 
            `${dietLevelText[dietLevel]}饮食，体脂率${bodyFatRange}`;
    });
    
    function getNutrientRatios(dietLevel, bodyFatRange, gender) {
        // 基于Excel表格数据定义比例
        const ratios = {
            low: {
                "25%~30%": {
                    male: {
                        breakfast: { carb: 0.3, protein: 0.25, fat: 0.2 },
                        lunch: { carb: 0.4, protein: 0.5, fat: 0.3 },
                        dinner: { carb: 0.3, protein: 0.25, fat: 0.2 }
                    },
                    female: {
                        breakfast: { carb: 0.23, protein: 0.2, fat: 0.1 },
                        lunch: { carb: 0.45, protein: 0.3, fat: 0.3 },
                        dinner: { carb: 0.3, protein: 0.2, fat: 0.2 }
                    }
                },
                "23%~25%": {
                    male: {
                        breakfast: { carb: 0.25, protein: 0.5, fat: 0.2 },
                        lunch: { carb: 0.45, protein: 0.7, fat: 0.3 },
                        dinner: { carb: 0.3, protein: 0.5, fat: 0.2 }
                    },
                    female: {
                        breakfast: { carb: 0.25, protein: 0.3, fat: 0.2 },
                        lunch: { carb: 0.45, protein: 0.4, fat: 0.3 },
                        dinner: { carb: 0.3, protein: 0.4, fat: 0.2 }
                    }
                },
                "20%~23%": {
                    male: {
                        breakfast: { carb: 0.25, protein: 0.5, fat: 0.2 },
                        lunch: { carb: 0.35, protein: 0.8, fat: 0.3 },
                        dinner: { carb: 0.4, protein: 0.7, fat: 0.3 }
                    },
                    female: {
                        breakfast: { carb: 0.25, protein: 0.4, fat: 0.2 },
                        lunch: { carb: 0.35, protein: 0.6, fat: 0.3 },
                        dinner: { carb: 0.4, protein: 0.5, fat: 0.2 }
                    }
                },
                "15%~20%": {
                    male: {
                        breakfast: { carb: 0.25, protein: 0.5, fat: 0.25 },
                        lunch: { carb: 0.45, protein: 1.0, fat: 0.45 },
                        dinner: { carb: 0.3, protein: 1.0, fat: 0.3 }
                    },
                    female: {
                        breakfast: { carb: 0.25, protein: 0.4, fat: 0.25 },
                        lunch: { carb: 0.45, protein: 0.6, fat: 0.45 },
                        dinner: { carb: 0.3, protein: 0.5, fat: 0.3 }
                    }
                }
            },
            medium: {
                // 中碳饮食的碳水和脂肪比例根据体脂率范围
                "25%~30%": {
                    male: {
                        breakfast: { carb: 0.5, protein: 0.25, fat: 0.1 },
                        lunch: { carb: 0.9, protein: 0.5, fat: 0.2 },
                        dinner: { carb: 0.6, protein: 0.25, fat: 0.1 }
                    },
                    female: {
                        breakfast: { carb: 0.5, protein: 0.2, fat: 0.1 },
                        lunch: { carb: 0.9, protein: 0.3, fat: 0.1 },
                        dinner: { carb: 0.6, protein: 0.2, fat: 0.1 }
                    }
                },
                "23%~25%": {
                    male: {
                        breakfast: { carb: 0.5, protein: 0.5, fat: 0.1 },
                        lunch: { carb: 0.5, protein: 0.7, fat: 0.2 },
                        dinner: { carb: 0.6, protein: 0.3, fat: 0.2 }
                    },
                    female: {
                        breakfast: { carb: 0.5, protein: 0.3, fat: 0.1 },
                        lunch: { carb: 0.5, protein: 0.4, fat: 0.2 },
                        dinner: { carb: 0.6, protein: 0.3, fat: 0.2 }
                    }
                },
                "20%~23%": {
                    male: {
                        breakfast: { carb: 0.5, protein: 0.5, fat: 0.1 },
                        lunch: { carb: 0.5, protein: 0.8, fat: 0.2 },
                        dinner: { carb: 0.6, protein: 0.7, fat: 0.2 }
                    },
                    female: {
                        breakfast: { carb: 0.5, protein: 0.4, fat: 0.1 },
                        lunch: { carb: 0.5, protein: 0.6, fat: 0.2 },
                        dinner: { carb: 0.6, protein: 0.5, fat: 0.2 }
                    }
                },
                "15%~20%": {
                    male: {
                        breakfast: { carb: 0.5, protein: 0.5, fat: 0.1 },
                        lunch: { carb: 0.5, protein: 1.0, fat: 0.2 },
                        dinner: { carb: 0.6, protein: 1.0, fat: 0.2 }
                    },
                    female: {
                        breakfast: { carb: 0.5, protein: 0.4, fat: 0.1 },
                        lunch: { carb: 0.5, protein: 0.6, fat: 0.2 },
                        dinner: { carb: 0.6, protein: 0.5, fat: 0.2 }
                    }
                }
            },
            high: {
                // 高碳饮食的碳水和脂肪比例固定，蛋白质根据体脂率范围
                "25%~30%": {
                    male: {
                        breakfast: { carb: 1.0, protein: 0.25, fat: 0 },
                        lunch: { carb: 1.5, protein: 0.5, fat: 0 },
                        dinner: { carb: 0.3, protein: 0.25, fat: 0 }
                    },
                    female: {
                        breakfast: { carb: 1.0, protein: 0.2, fat: 0 },
                        lunch: { carb: 1.5, protein: 0.3, fat: 0 },
                        dinner: { carb: 0.3, protein: 0.2, fat: 0 }
                    }
                },
                "23%~25%": {
                    male: {
                        breakfast: { carb: 1.0, protein: 0.5, fat: 0 },
                        lunch: { carb: 1.5, protein: 0.7, fat: 0 },
                        dinner: { carb: 0.3, protein: 0.3, fat: 0 }
                    },
                    female: {
                        breakfast: { carb: 1.0, protein: 0.3, fat: 0 },
                        lunch: { carb: 1.5, protein: 0.4, fat: 0 },
                        dinner: { carb: 0.3, protein: 0.3, fat: 0 }
                    }
                },
                "20%~23%": {
                    male: {
                        breakfast: { carb: 1.0, protein: 0.5, fat: 0 },
                        lunch: { carb: 1.5, protein: 0.8, fat: 0 },
                        dinner: { carb: 0.3, protein: 0.7, fat: 0 }
                    },
                    female: {
                        breakfast: { carb: 1.0, protein: 0.4, fat: 0 },
                        lunch: { carb: 1.5, protein: 0.6, fat: 0 },
                        dinner: { carb: 0.3, protein: 0.5, fat: 0 }
                    }
                },
                "15%~20%": {
                    male: {
                        breakfast: { carb: 1.0, protein: 0.5, fat: 0 },
                        lunch: { carb: 1.5, protein: 1.0, fat: 0 },
                        dinner: { carb: 0.3, protein: 1.0, fat: 0 }
                    },
                    female: {
                        breakfast: { carb: 1.0, protein: 0.4, fat: 0 },
                        lunch: { carb: 1.5, protein: 0.6, fat: 0 },
                        dinner: { carb: 0.3, protein: 0.5, fat: 0 }
                    }
                }
            }
        };
        
        return ratios[dietLevel][bodyFatRange][gender];
    }
    
    function displayResults(breakfast, lunch, dinner, dietLevel, bodyFatRange, gender) {
        // 显示早餐结果
        document.getElementById('breakfast-results').innerHTML = createMealHTML(breakfast, "早餐");
        
        // 显示午餐结果
        document.getElementById('lunch-results').innerHTML = createMealHTML(lunch, "午餐");
        
        // 显示晚餐结果
        document.getElementById('dinner-results').innerHTML = createMealHTML(dinner, "晚餐");
    }
    
    function createMealHTML(meal, mealName) {
        let html = '';
        
        // 添加碳水化合物
        if (meal.carb > 0) {
            html += `
                <div class="nutrient">
                    <span class="nutrient-name">碳水化合物</span>
                    <span class="nutrient-value">${meal.carb} 克</span>
                </div>
            `;
        }
        
        // 添加蛋白质
        if (meal.protein > 0) {
            html += `
                <div class="nutrient">
                    <span class="nutrient-name">蛋白质</span>
                    <span class="nutrient-value">${meal.protein} 克</span>
                </div>
            `;
        }
        
        // 添加脂肪
        if (meal.fat > 0) {
            html += `
                <div class="nutrient">
                    <span class="nutrient-name">脂肪</span>
                    <span class="nutrient-value">${meal.fat} 克</span>
                </div>
            `;
        }
        
        // 添加食物示例
        html += `
            <div class="food-examples">
                <h4>${mealName}食物示例（约等于）:</h4>
                <div class="food-list">
        `;
        
        if (meal.carb > 0) {
            html += `<div class="food-item">米饭 ${Math.round(meal.carb / 0.25)}克</div>`;
            html += `<div class="food-item">全麦面包 ${Math.round(meal.carb / 0.45)}克</div>`;
        }
        
        if (meal.protein > 0) {
            html += `<div class="food-item">鸡胸肉 ${Math.round(meal.protein / 0.31)}克</div>`;
            html += `<div class="food-item">鸡蛋 ${Math.round(meal.protein / 0.13)}克</div>`;
        }
        
        if (meal.fat > 0) {
            html += `<div class="food-item">橄榄油 ${Math.round(meal.fat / 1)}克</div>`;
            html += `<div class="food-item">坚果 ${Math.round(meal.fat / 0.5)}克</div>`;
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
});