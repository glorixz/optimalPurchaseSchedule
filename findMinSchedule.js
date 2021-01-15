// This algorithm is given an array containing the demand for a product, for each day.
// The goal is to find the optimal schedule for purchasing the product, given that it
// has cost p per unit, and that there is a storage limit of L. At the end of each day
// the unsold product incurs a cost of e per unit. 

// demand for each day, in REVERSE order
// i.e. last day is demand[0]
let demand = [1,4,2,7,4,2,3,5];

//limit
let L = 10;
// storage cost per unit, applied at the end of each day
let e = 1; 

// purchase cost per litre
let p = 1; 

// pickup cost
let P = 3;

// return the cost of storage for days i to j.
// assume that the sum of the demand is < L
function storageCost(i,j, purchaseSize) {
    // assume i >= j
    let stock = purchaseSize;
    let totalCost = 0;
    for (let k = i; k>=j; k--) {
        stock -= demand[k];
        totalCost += e * stock;
    }
    return totalCost;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// schedule of optimal purchases, beginning with the first purchase.
// each purchase has form [day, amount]. 
var schedule = [];

// memo[i] contains the minimum cost of purchasing on
// day i including the recursive cost
//form: [j,cost] where j is the day in the future where
// we intend to run out of stock.
var memo = createArray(demand.length);

// entry [i][j] contains the sum of the demand in the interval i,j. 
var cumulativeDemand = createArray(demand.length, demand.length);

var recursionCounter = 0;

function findMinSchedule () {
    // console.log(findMinRecursive(demand.length - 1);
    let minCost = findMinRecursive(demand.length - 1);
    extractSchedule();
    console.log("the minimum cost is: ", minCost);
    console.log("memo:", memo);
    console.log("recursions:", recursionCounter);
    console.log("schedule:");
    console.log(schedule);
}

function extractSchedule() {
    let day = demand.length;
    while (day > 0) {
        let m = memo[day-1];
        schedule.push([day, cumulativeDemand[day-1][m[0]]]);
        day = m[0];
    }
}

function findMinRecursive(i) {
    recursionCounter++;
    // base case
    if (i === -1) return 0;
    //console.log("entering recursion i = ", i);
    
    let j = i;
    let intervalDemand = 0;
    // for all j, costs contains the cost of purchasing on
    //day j + all further costs. 
    // each entry has form [j, cost]. 
    let costs = [];
    
    while (j !== -1 && intervalDemand + demand[j] <= L) {
        intervalDemand += demand[j];
        cumulativeDemand[i][j] = intervalDemand;
        let recursiveCost = P + p*intervalDemand + storageCost(i,j,intervalDemand);
        if (memo[j-1] != null) {
            recursiveCost += memo[j-1][1];
        } else {
            recursiveCost += findMinRecursive(j-1);
        }
        
        costs.push([j, recursiveCost]);
        j--;
    }
    // console.log("list of costs at i =", i);
    // console.log(costs);
    let minCost = [i,Number.POSITIVE_INFINITY];
    for (let interval = 0; interval < costs.length; interval++) {
        if (costs[interval][1] < minCost[1]) {
            minCost = costs[interval];
        }
    }
    // console.log("minCost: buy until day j=", minCost[0], "for total recursive cost", minCost[1]);
    if (memo[i] == null) {
        memo[i] = minCost;
    }
    return minCost[1];
}

findMinSchedule();