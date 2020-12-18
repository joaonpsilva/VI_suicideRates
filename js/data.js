class Country {
    constructor(name) {
      this.name = name;
      this.total = 0;
      this.per100k = 0;
      this.perSex = {'male': 0, "female":0};
      this.perAge = {'24- years':0,'25-34 years':0,'35-54 years':0,'55-74 years':0, '75+ years':0};
      this.popPerSex= {'male': 0, "female":0};
      this.popPerAge = {'24- years':0,'25-34 years':0,'35-54 years':0,'55-74 years':0, '75+ years':0};
      this.population = 0;
      this.gdp = 0
      this.gdpPerCap = 0
    }
    get cname() {
      return this.name;
    }
  
    get ctotal(){
      return this.total;
    }
    get cgdp(){
      return this.gdp;
    }
    get cgdpPerCap(){
      return this.gdpPerCap;
    }
  
    get cpopulation(){
      return this.population;
    }
  
    addPopulation(p){
      this.population += p;
    }
  
    addPerSex(sex, n){
      this.perSex[sex] += n;
    }

    addPopulationPerSex(sex, n){
      this.popPerSex[sex] += n;
    }
    

    addSuicideno(n){
      this.total += n;
    }
  
    addPerAge(age, n){
      this.perAge[age] += n;
    }
    addPopulationPerAge(age, n){
      this.popPerAge[age] += n;
    }

    setPer100k(val){
      this.per100k = val;
    }
    setGdp(val){
      this.gdp = val;
    }
    setGdpPerCap(val){
      this.gdpPerCap = val;
    }
}

var data = {};
var dataLine = {};
