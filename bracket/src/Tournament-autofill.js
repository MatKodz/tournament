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
        props.parentCallback(winner,props.roundLevel,props.indexGroupPlayer)
        if(winner == null)
        {
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
    <span onClick={props.handleClick}>X</span>
  </div>;
}

function RegisterBracket(props) {
  let options= {
    method : "POST",
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(props.brackets)
  }
  const handleClickRegister = () => {
    fetch("../../get-bracket.php",options)
    .then( data => console.log(data))
    .catch(e => console.error('Error:' + e));
  }
  return <div className="register">
    <button onClick={handleClickRegister}>Enregistrer le bracket</button>
  </div>;
}

// Create a function to wrap up your component
function Tournament(){
    const[hasError,setHasError] = React.useState("");
    const[brackets,setBrackets] = React.useState({
      "round1" : [],
      "round2" : [[],[]],
      "round3" : [[]],
      "final" : [[]]
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
        .then(data =>
          { if ( data.length !== 0 && data.length !== 9)
            setBrackets({...brackets,"round1": shufflePlayers(data) } )
            else setHasError("Nombre joueur erroné")
          }
         )
        .catch(e => console.error('Error:' + e));

    },[]);

    const callbackPlayer = React.useCallback(
    (nameWinner,levelWinner,indexWinner) =>
    {
      if (nameWinner == null)
      return setHasError("Score identique")
      if(levelWinner) {
        let roundList = stateBrackets.current[levelWinner].slice()
        let indexGroup = Math.floor(indexWinner / 2)
        let indexPlayer = indexWinner % 2
        console.log(roundList,indexGroup,indexPlayer)
        roundList[indexGroup][indexPlayer] = nameWinner
        /*if (r1.length > 0 && r1[r1.length - 1 ].length < 2) {

        }*/
        /*
        else {
        r1.push([nameWinner])
        }
        */
        let tempBrackets = {...stateBrackets.current}
        tempBrackets[levelWinner] = roundList
        setBrackets(tempBrackets);
      }
    },
    []
    );

    const handleClick = () => {
      setHasError("")
    }


return(
    <div>
    { hasError  ?
      <MessageBox handleClick={handleClick}>
      {hasError}
      </MessageBox>
      : "" }

     <div className="battle-wrapper">
      <div className="battle-list">
          {
            brackets.round1.map( (players,i) => <Player parentCallback={callbackPlayer} username={ players } key={i} roundLevel={"round2"} indexGroupPlayer={i} /> )
        }
        </div>

        <div className="battle-list-1">
       {
            brackets.round2.map( (players,i) =>
            <CSSTransition appear in={ brackets.round2[i].length > 0 } timeout={500} classNames="fade-answers" key={i}>
            <Player parentCallback={callbackPlayer} username={ players } roundLevel={"round3"} indexGroupPlayer={i}  />
            </CSSTransition>
            )
        }
        </div>


        <div className="battle-list-2">
        {
             brackets.round3.map( (players,i) =>
             <CSSTransition appear in={brackets.round3[i].length > 0} timeout={500} classNames="fade-answers" key={i}>
             <Player parentCallback={callbackPlayer} username={ players } roundLevel={"final"} indexGroupPlayer={i} />
             </CSSTransition>
             )
         }
        </div>
    </div>
    <RegisterBracket brackets={brackets} />
    </div>
)
}

export default Tournament
