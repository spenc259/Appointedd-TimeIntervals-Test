const fs = require('fs')
const path = './testcase.txt'

fs.readFile(path, (err, txtdata) => {
    console.info("reading file...");

    if (err) {
        throw err
    }
    
    const filedata = txtdata.toString().split("\n");
    let workers = getWorkers(filedata);

    solve(workers)
})

const getWorkers = (filedata) => {
    console.info("getting workers from file...")
    return filedata.map((v,i) => {
        let result = v.match(/\[(.*)\]/);

        if (result === null)
            return

        return result[1];
    })
}

const solve = (workers) => {
    console.info("running solver....");
    let q1 = Question1(workers);
    console.info(q1);
    
    let q2 = Question2(workers);
    console.info(q2);
    
    let q3 = Question3(workers);
    for (let i = 0; i < q3.length; i++) {
        console.log(q3[i]);
    }
}

/* Questions */

const Question1 = (workers) => {
    console.info("\n\nQuestion 1 \nWhat is the starting date and time (in UTC) of the earliest interval where any of the workers are free?");

    // we need to do a comparasion of the earlist starting dates of each interval per worker, then we can compare against all workers
    let starts = []
    // get dates of each worker
    workers.forEach( (w, i) => {
        starts.push( calcTimes(getIntervals(w), 'desc'))
    } )
    
    starts.sort( (a, b) => {
        return a - b;
    } )

    return starts[0];
}


const Question2 = (workers) => {
    console.info("\n\nQuestion 2\nWhat is the ending date and time (in UTC) of the latest interval where any of the workers are free?");
    let ends = []
    // get dates of each worker
    workers.forEach( (w, i) => {
        ends.push( calcTimes(getIntervals(w), 'asc') )
    } )
    
    ends.sort( (a, b) => {
        return b - a;
    } )

    return ends[0];
}



const Question3 = (workers) => {
    console.info("\n\nQuestion 3\nWhat are the intervals of date and times (in UTC) where there are at least 2 workers free?");

    let starts = []
    let ends = []
    let overlaps = []
    let times = []
    // compare each workers endtime to every other workers start time
    // if the endtime is greater than the other start time and less than the other end time we have an overlap
    workers.forEach( (w, i) => {
        // get a list of start and end times for the current worker
        intervalStarts = getStartTimes( getIntervals(w) );
        starts.push( intervalStarts );

        intervalEnds = getEndTimes( getIntervals(w) );
        ends.push( intervalEnds )

    } )

    // map though each end array
    ends.map( (cw,ind) => {
        // for each end item
        for (let e = 0; e < cw.length; e++) {
            // map through each start array
            starts.map((v, i) => {
                // loop the start dates in the sub arrays
                for (let s = 0; s < v.length; s++) {
                    // is the current end time greater than the current start time 
                    // AND is the current start time less than the end time for another worker
                    // Astart < Bend && Aend > Bstart 
                    // AND to make the overlap stricter we say is the current worker start time less than the other workers end time
                    // if (cw[e] > v[s] && cw[e] < ends[i][s] && starts[ind][e] > v[s] && starts[ind][e] < ends[i][s]) {
                    // if () {
                    //     overlaps.push(v[s] + '/' + cw[e]);
                    // }
                }
            })
        }

    })

    workers.forEach((w, index) => {
        times.push(getIntervals(w));
    })

    // is my start less than their end AND is my end greater than their start
    // (StartA <= EndB) and (EndA >= StartB)
    /// A = 1-----3
    /// B =    2-----4

    // let times = [['1/3','5/7'], ['2/4', '6/8']];
    // create an array of times start/end
    // foreach time, split and loop through the times array, split and compare
    times.forEach((v,wi) => {

        for(let i = 0; i < v.length; i++) {
            
            let starttime = new Date(v[i].split('/')[0]); // 1 // new date to convert the times to UTC
            let endTime = new Date(v[i].split('/')[1]); // 3

            times.forEach((v,wj) => {

                for(let i = 0; i < v.length; i++) {
                    let othertimes = v[i].split('/');
                    let otherStartTime = new Date(othertimes[0]) // 2
                    let otherEndTime = new Date(othertimes[1]) // 4
                    
                    if (starttime < otherEndTime && endTime > otherStartTime && wi !== wj) {
                        // console.log(new Date(Math.max(starttime, otherStartTime)).toISOString() + '/' + new Date(Math.min(endTime,otherEndTime)).toISOString());
                        overlaps.push(new Date(Math.max(starttime, otherStartTime)).toISOString() + '/' + new Date(Math.min(endTime,otherEndTime)).toISOString())
                    }
                }
            }) 
        }
    }) 

    

    // ensure we have unique values
    return [...new Set(overlaps)]
}

/* Helpers */

const getStartTimes = (intervals) => {
    return intervals.map( (int, index) => {
        // split into start and end
        let dates = int.split('/');
        // convert both into UTC
        return new Date(dates[0]);
    })
}

const getEndTimes = (intervals) => {
    return intervals.map( (int, index) => {
        // split into start and end
        let dates = int.split('/');
        // convert both into UTC
        return new Date(dates[1]);
    })
}

const getIntervals = (sw) => {
    return sw.split(',');
}

const calcTimes = (intervals, direction) => {
    let times = []

    intervals.forEach((int, index) => {
        let dates = int.split('/');

        if (direction == 'desc') {
            times.push(new Date(dates[0]))
        } else {
            times.push(new Date(dates[1]))
        }
        
    })

    // array sort and return
    times.sort( (a, b) => {
        if (direction == 'desc') {
            return a - b;
        } else {
            return b - a;
        }
    } )

    return times[0];
}

