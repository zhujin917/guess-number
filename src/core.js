function getPrimes() {
    let primes = [];
    for (let n = 2; n <= 99; n += 1) {
        let isPrime = true;
        for (let i = 2; i < n; i += 1) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(n);
        }
    }
    return primes;
}

function calcNum(n, range) {
    if (range == "itself") return n;
    if (range == "first") return Math.floor(n / 10);
    if (range == "second") return n % 10;
    if (range == "sum") return Math.floor(n / 10) + (n % 10);
    if (range == "diff") return Math.abs(Math.floor(n / 10) - (n % 10));
    if (range == "prod") return Math.floor(n / 10) * (n % 10);
}

export class RobotGuessing {

    threshold;

    primes;
    numbers;

    latestQuestion;

    constructor() {
        this.threshold = Math.random() * (0.4 - 0.1) + 0.1;

        this.primes = getPrimes();

        this.numbers = [];
        for (let i = 10; i <= 99; i += 1) {
            this.numbers.push(i);
        }
    }

    calcNums(range, retAsArray = false) {
        let nums = this.numbers.map(n => calcNum(n, range));
        if (!retAsArray) return nums;
        else return [nums, range];
    }

    isBetterProportion(newProportion, oldProportion) {
        newProportion = Math.min(newProportion, 1 - newProportion);
        oldProportion = Math.min(oldProportion, 1 - oldProportion);
        if (newProportion == 0) return false;
        return Math.abs(newProportion - this.threshold) < Math.abs(oldProportion - this.threshold);
    }

    getQuestion() {
        class Question {
            constructor(way, range, proportion, number) {
                this.way = way;
                this.range = range;
                this.proportion = proportion;
                this.number = number;
            }
        }

        let biggerOrSmaller = (nums = [], range) => {
            let p = Math.floor(nums.length / 2) / nums.length;
            let i = (nums.length % 2 == 1) ? Math.floor(nums.length / 2) : Math.round(nums.length / 2 - Math.random());
            let w;
            if (i == 0) w = "bigger";
            else if (i == nums.length - 1) w = "smaller";
            else w = Math.round(Math.random()) ? "bigger" : "smaller";
            return new Question(w, range, p, nums[i]);
        };
        let ifIsTimes = (nums = [], range) => {
            let p = null, n;
            for (let prime of this.primes) {
                let count = 0;
                for (let num of nums) {
                    if (num % prime == 0) count += 1;
                }
                if (!p || this.isBetterProportion(count / nums.length, p)) {
                    p = count / nums.length;
                    n = prime;
                }
            }
            return new Question("times", range, p, n);
        };
        let ifIsPrime = (nums = [], range) => {
            let count = 0;
            for (let num of nums) {
                if (this.primes.includes(num)) count += 1;
            }
            return new Question("prime", range, count / nums.length);
        };

        let iNums = this.calcNums("itself", true);
        let fNums = this.calcNums("first", true);
        let sNums = this.calcNums("second", true);
        let uNums = this.calcNums("sum", true);
        let dNums = this.calcNums("diff", true);
        let pNums = this.calcNums("prod", true);

        let getFinalQuestion = (...questions) => {
            let finalQuestion = null;
            for (let question of questions) {
                if (!finalQuestion || this.isBetterProportion(question.proportion, finalQuestion.proportion)) {
                    finalQuestion = question;
                }
            }
            return finalQuestion;
        };

        this.latestQuestion = getFinalQuestion(
            biggerOrSmaller(...iNums), ifIsTimes(...iNums), ifIsPrime(...iNums),
            biggerOrSmaller(...fNums), ifIsTimes(...fNums), ifIsPrime(...fNums),
            biggerOrSmaller(...sNums), ifIsTimes(...sNums), ifIsPrime(...sNums),
            biggerOrSmaller(...uNums), ifIsTimes(...uNums), ifIsPrime(...uNums),
            biggerOrSmaller(...dNums), ifIsTimes(...dNums), ifIsPrime(...dNums),
            biggerOrSmaller(...pNums), ifIsTimes(...pNums), ifIsPrime(...pNums)
        );
        return this.latestQuestion;
    }

    applyAnswer(question, answer) {
        let filteredNumbers = [];
        let nums = this.calcNums(question.range);
        for (let i in nums) {
            if (
                (question.way == "bigger" && answer == (nums[i] > question.number))
                || (question.way == "smaller" && answer == (nums[i] < question.number))
                || (question.way == "times" && answer == (nums[i] % question.number == 0))
                || (question.way == "prime" && answer == this.primes.includes(nums[i]))
            ) {
                filteredNumbers.push(this.numbers[i]);
            }
        }
        let filteredProportion = filteredNumbers.length / this.numbers.length;
        this.numbers = filteredNumbers;
        return Math.min(filteredProportion, 1 - filteredProportion);
    }
}

export class YouGuessing {

    sumThreshold = 0;

    primes;
    targetNumber;

    constructor() {
        this.primes = getPrimes();
        this.targetNumber = Math.floor(Math.random() * (100 - 10) + 10);
    }

    giveAnswer(question) {
        let asking = calcNum(this.targetNumber, question.range);
        if (question.way == "bigger") return asking > question.number;
        if (question.way == "smaller") return asking < question.number;
        if (question.way == "times") return (asking % question.number == 0);
        if (question.way == "prime") return this.primes.includes(asking);
    }
}