class Country {
    constructor(name) {
      this.name = name;
      this.total = 0;
      this.per100k = 0;
      this.perSex = {'male': 0, "female":0};
      this.perAge = {'5-14 years':0, '15-24 years':0,'25-34 years':0,'35-54 years':0,'55-74 years':0, '75+ years':0};
      this.population = 0; 
    }
    get cname() {
      return this.name;
    }
  
    get ctotal(){
      return this.total;
    }
  
    get cpopulation(){
      return this.population;
    }
  
    addPopulation(p){
      this.population += p;
    }
  
    addPerSex(sex, n){
      this.perSex[sex] += n;
      this.total += n;
    }
  
    addPerAge(age, n){
      this.perAge[age] += n;
      this.total += n;
    }
}

var data = {};
var dataLine = {};
