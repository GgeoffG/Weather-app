var previousSearchList=document.getElementById('previousSearch')
console.log(previousSearchList)
var todayForcast=document.getElementById('todayForcast')
console.log(todayForcast)
var fiveDay=document.getElementsByClassName('fiveDay')
var dayIds= []
for (i=0;i<fiveDay.length;++i){
    dayIds.push(fiveDay[i].id)
    
}
console.log(dayIds)

