import React from 'react';
import {CSSTransition} from 'react-transition-group';


// Create a ES6 class component
function Player(props) {
    const [score1, setScore1] = React.useState(null);
    const [score2, setScore2] = React.useState(null);

    let className = "battle-player battle-player";

    React.useEffect( () => {
      if(score1 && score2) {
        let winner = score1 > score2 ? props.username[0] : score2 > score1 ? props.username[1] : null;
        if(winner)
        props.parentCallback(winner,props.roundLevel)
        else {
          alert("Score identique")
          setScore1(null)
          setScore2(null)
        }
      }
        return () => {
        }
    },[score1,score2]);

    const checkScore = ()  => {
      if(score1 && score2 && score1 == score2) {
        console.log("id")
        setScore1(null)
        setScore2(null)
      }
    }

    const onChangeHandle = (e) => {
        setUsername(prevState => e.target.value)
    };
    const onBlurHandleScore1 = (e) => {
        if ( parseInt(e.target.value) ) {
            setScore1(prevState => e.target.value)
        }
        else e.target.style = "border: 2px solid red;"
    };
    const onBlurHandleScore2 = (e) => {
        if (parseInt(e.target.value)) {
            setScore2(prevState => e.target.value)
        }
        else e.target.style = "border: 2px solid red;"
    };
    return <div className="battle">
        <div className={ !score1 ? className : score1 > score2 ? className  + "-win" : className + "-loose" }>
        <div  className="user-name"><h2>{props.username[0]}</h2></div>
        <div className="score"> { score1 ?
            <h3>{score1}</h3>
            : <div><label>Scoring : </label>
            <input type="number" name="userscore1" placeholder="Enter the score" onBlur={onBlurHandleScore1} /></div>
            }
        </div>
        </div>
        <div className={ !score2 ? className : score2 > score1 ? className  + "-win" : className + "-loose" }>
        <div  className="user-name"><h2>{props.username[1]}</h2></div>
        <div className="score"> { score2 ?
            <h3>{score2}</h3>
            : <div><label>Scoring : </label>
            <input type="number" name="userscore2" placeholder="Enter the score" onBlur={onBlurHandleScore2} /></div>
            }
        </div>
        </div>
     </div>;
}

function MessageBox(props) {
  return <div className="alert-wrapper">
    <div className="alert-warning">
    {props.children}
    </div>
  </div>;
}

// Create a function to wrap up your component
function Tournament(){
    const[brackets,setBrackets] = React.useState({
      "round1" : [],
      "round2" : [],
      "round3" : [],
      "final" : []
    })
    const stateBrackets = React.useRef();

    let numberPlayers = brackets.round1.flat().length

    stateBrackets.current = brackets;

      const shufflePlayers = (list) => {
      list.sort((a, b) => 0.5 - Math.random());
      let group = []
      let groupPlayers = []
      list.forEach( (elt,i) => {
          group.push(elt)
          if(i == 0 || i % 2 == 0 ) {
              groupPlayers.push(group);
          }
          else group = []
      })
      return groupPlayers
      }

      React.useEffect(() => {
        fetch("https://class-kodz.alwaysdata.net/demo/tournament/players-list.php")
        .then(response => response.json() )
        .then(data => setBrackets({...brackets,"round1": shufflePlayers(data) } ) )
        .catch(e => console.error('Error:' + e));
    },[]);

    const callback = React.useCallback(
    (nameWinner,levelWinner) =>
    {
      if(levelWinner) {
        console.log(levelWinner)
        let r1 = stateBrackets.current[levelWinner].slice()
        if (r1.length > 0 && r1[r1.length - 1 ].length < 2) {
          r1[r1.length - 1 ].push(nameWinner)
        }
        else {
          r1.push([nameWinner])
        }
        let tempBrackets = {...stateBrackets.current}
        tempBrackets[levelWinner] = r1
        setBrackets(tempBrackets);
      }
    },
    []
    );


return(
    <div className="battle-wrapper">
      <div className="battle-list">
          {
            brackets.round1.map( (players,i) => <Player parentCallback={callback} username={ players } key={i} roundLevel={"round2"} /> )
        }
        </div>

        <div className="battle-list-1">
       {
            brackets.round2.map( (players,i) =>
            <CSSTransition appear in={ brackets.round2.length > 1 } timeout={500} classNames="fade-answers" key={i}>
            <Player parentCallback={callback} username={ players } roundLevel={"round3"}  />
            </CSSTransition>
            )
        }
        </div>


        <div className="battle-list-2">
        {
             brackets.round3.map( (players,i) =>
             <CSSTransition appear in={brackets.round3[i].length > 0} timeout={500} classNames="fade-answers" key={i}>
             <Player parentCallback={callback} username={ players } roundLevel={"final"} />
             </CSSTransition>
             )
         }
        </div>
        { numberPlayers !== 0 && numberPlayers !== 8 ?
          <MessageBox>
          Nombre de joueur incorrect ({numberPlayers})
          </MessageBox>
          : "" }
    </div>
)
}

export default Tournament
