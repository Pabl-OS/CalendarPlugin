import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import * as range from 'lodash.range';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}

export interface Month {
  name: string;
  number: string;
}
export interface Year {
  year: number
}

export interface CalendarDates {
  month:string;
  year:string;
  days: Dates[];
}

export interface Dates {
  dateShort  :string;
  year       :string;
  month      :string;
  monthName  :string;
  day        :string;
  dayName    :string;
  isSelected :boolean;
  weekDate   :number;
}

@Component({
  selector: 'app-daily-selection',
  templateUrl: './daily-selection.component.html',
  styleUrls: ['./daily-selection.component.scss']
})
export class DailySelectionComponent implements OnInit {
  public currentDate: moment.Moment;
  public namesOfDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  public namesOfDaysAll = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public monthNumber =  (new Date().getMonth()+1).toString();
  public weeksArray: any[] = []
  public calendarArray: any[] = []
  public loadingCalendar:boolean;
  public nameMonths:Month[] = [
    {
      name: 'Enero',
      number: '01'
    },
    {
      name: 'Febrero',
      number: '02'
    },
    {
      name: 'Marzo',
      number: '03'
    },
    {
      name: 'Abril',
      number: '04'
    },
    {
      name:'Mayo',
      number: '05'
    },
    {
      name: 'Junio',
      number: '06'
    },
    {
      name: 'Julio',
      number: '07'
    },
    {
      name: 'Agosto',
      number: '08'
    },
    {
      name: 'Septiembre',
      number:'09'
    },
    {
      name: 'Octubre',
      number: '10'
    },
    {
      name: 'Noviembre',
      number: '11'
    },
    {
      name:'Diciembre',
      number: '12'
    }
  ]
  public weeks: Array<CalendarDate[]> = [];

  public selectedDate;
  public show: boolean;
  public years: number[] = [
       new Date().getFullYear(),
       new Date().getFullYear() + 1,
       new Date().getFullYear() + 2,
    ];
  public startDate:string;
  public endDate  :string;
  public FormRangeDate:FormGroup = this._fb.group({
    startMonth :   ['0'+this.monthNumber,Validators.required],
    endMonth   :   ['0'+(+this.monthNumber+2),Validators.required],
    initialYear:   [new Date().getFullYear(),Validators.required],
    endYear    :   [new Date().getFullYear(),Validators.required],
  })

  clickOut(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.show = false;
    }
  }

  constructor(private eRef: ElementRef,
              private _fb:FormBuilder) {
  }

  ngOnInit() {
    this.handleCreateCalendar();

  }


   getDates(startDate:any, stopDate:any) {
    var dateArray:Dates[] = [];
    var currentDate = moment(startDate);
    var stopDate:any = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( {
                         dateShort:moment(currentDate).format('YYYY-MM-DD'),
                         year:moment(currentDate).format('YYYY'),
                         month:moment(currentDate).format('MM'),
                         monthName:moment(currentDate).format('MMMM'),
                         day:moment(currentDate).format('DD'),
                         dayName: moment(currentDate).format('dddd'), 
                         isSelected: false,
                         weekDate:moment(currentDate).week(),
                           } )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}


handleCreateCalendar(){
  if (this.FormRangeDate.invalid) {
    return;
  }
  this.loadingCalendar = true;
  this.createArrayDate( this.getDates(`${this.FormRangeDate.get('initialYear').value}-${this.FormRangeDate.get('startMonth').value}-01`,
  `${this.FormRangeDate.get('endYear').value}-${this.FormRangeDate.get('endMonth').value}-${new Date(this.FormRangeDate.get('endYear').value,this.FormRangeDate.get('endMonth').value ,0).getDate()}`))
}

createArrayDate(arrayDate: Dates[]){
  var arrayDatesTemp = [];
  //? reset array weeks
  this.weeksArray = [];
  //? create array of join this.weeks to dates
  for (var i = 0; i < arrayDate.length; i++) {
    arrayDatesTemp = this.weeksArray.filter((date: any) => 
                    date["weeksMonth"] == arrayDate[i].weekDate && date["year"] == arrayDate[i].year && 
                    date["monthName"] == arrayDate[i].monthName);
    if (arrayDatesTemp.length > 0) {
      this.weeksArray[this.weeksArray.indexOf(arrayDatesTemp[0])]["days"].push(arrayDate[i])
    } else {
      this.weeksArray.push(
        { 
          "weeksMonth":arrayDate[i].weekDate, 
          "monthName": arrayDate[i].monthName,
          "year": arrayDate[i].year, 
          "days": [arrayDate[i]] })
    }
  }
  //? reset calendar dates
  this.calendarArray = [];
  //? create array of years and months  to dates
  var arrayWeeksTemp = []
  for (var i = 0; i < this.weeksArray.length; i++) {
    arrayWeeksTemp = this.calendarArray.filter((date: any) => 
                    date["monthName"] == this.weeksArray[i].monthName && date["year"] == this.weeksArray[i].year);
    if (arrayWeeksTemp.length > 0) {
      this.calendarArray[this.calendarArray.indexOf(arrayWeeksTemp[0])]["month"].push(this.weeksArray[i])
    } else {
      this.calendarArray.push(
        { 
          "monthName": this.weeksArray[i].monthName,
          "year"     : this.weeksArray[i].year, 
          "month"    : [ this.weeksArray[i] ] 
        })
    }

  }
  this.loadingCalendar = false;  
}


selectDay(day:string ){

  if (this.startDate) this.endDate = day;
    else this.startDate = day;



    this.calendarArray.map(date => {
      date.month.map(week => {
        week.days.map(day => {
          if(day.dateShort == this.startDate){
            day.isSelected = !day.isSelected  
          }
        })
      })
    })  


    if (!this.endDate) return;
    console.log(this.startDate,this.endDate);
    
    if (this.startDate > this.endDate) {
      var aux = this.startDate;
      this.startDate = this.endDate;
      this.endDate = aux;
    }
    console.log(this.startDate,this.endDate);

    let isSelected = this.isRangeDaySelected();
      
    this.calendarArray.map(date => {
      date.month.map(week => {
        week.days.map(day => {
          if(day.dateShort >= this.startDate && day.dateShort <= this.endDate){
            day.isSelected = !isSelected 
          }
        })
      })
    })  

    if (this.startDate) {
      this.startDate = '';
      this.endDate   = '';
    }
}

selectAnyDayOfWeek(dayS:string,month:string,year:string){
  let isAllSelected = this.isWeekanyDaySelected(dayS);  
  this.calendarArray.map(date => {
    date.month.map(week => {
      week.days.map(day => {
        if(day.dayName == dayS && day.monthName == month && day.year == year){
          day.isSelected = !isAllSelected;          
        }
      })
    })
  })  
}


isWeekanyDaySelected(dayS:string):boolean{
  let isAnySelected = false;
  this.calendarArray.map(date => {
    date.month.map(week => {
      week.days.map(day => {
        if(day.dayName == dayS && day.isSelected){
          isAnySelected = true
        }
      })
    })
  })
  return isAnySelected;
}


isRangeDaySelected():boolean{
  let isAnySelected = false;
  this.calendarArray.map(date => {
    date.month.map(week => {
      week.days.map(day => {
        if(day.dateShort >= this.startDate && day.dateShort <= this.endDate && day.isSelected){
          isAnySelected = true
        }
      })
    })
  })
  return isAnySelected;
}



selectAnyDayOfAll(dayS:string){
  let isAllSelected = this.isAllanyDaySelected(dayS);  
  this.calendarArray.map(date => {
    date.month.map(week => {
      week.days.map(day => {
        if(day.dayName == dayS){
          day.isSelected = !isAllSelected;
      
        }
      })
    })
  })
}
isAllanyDaySelected(dayS:string):boolean{
  let isAnySelected = false;
  this.calendarArray.map(date => {
    date.month.map(week => {
      week.days.map(day => {
        if(day.dayName == dayS && day.isSelected){
          isAnySelected = true
        }
      })
    })
  })
  return isAnySelected;
}



isAllDaySelected():boolean{
  let isAllSelected = false;
  this.calendarArray.map(date => {
    date.month.map(week => {
      week.days.map(day => {
        if(day.isSelected){
          isAllSelected = true
        }
      })
    })
  })
  return isAllSelected;
}
}