import React from 'react';
import {Transition,CSSTransition} from 'react-transition-group';


// Create a ES6 class component
function Player_test(props) {
  let joueurs = [,];

  if(props.usernames.length) {
    joueurs = props.usernames
  }
  console.log("from test",joueurs)
  return <div>
  <p>

  </p>
  {
    props.usernames.map( (elt,i) => <p key={i}> ll : {elt.player_name} </p> )
  }
  </div>
}

function Player(props) {
  const [score,setScore] = React.useState(null);

    const onChangeHandleScore = (e) => {
        if (Number(e.target.value)) {
          setScore(e.target.value)
        }
    }

  let className = "battle-player ";
  className += !props.winner ? "battle-player" : props.winner == props.item ? "battle-player-win" : "battle-player-loose";

  return    <div className={className} >
            <div className="user-name">
            <h2>{props.joueur.player_name}</h2>
            { props.joueur.player_avatar ?
            <img src={"../" + props.joueur.player_avatar} alt="" />
            : <span className="no-picture"></span>
            }
            </div>
            <div className="score"> { props.score ?
                <h3>{props.score}</h3>
                : <div><label>Scoring : </label>
                <input type="number" name={"userscore" + props.item} placeholder="Enter the score" onBlur={props.onBlurHandleScore} /></div>
                }
            </div>
          </div>
}

function DuoPlayer(props) {
    const [score1, setScore1] = React.useState(null);
    const [score2, setScore2] = React.useState(null);
    const [winnerParty, setWinnerParty] = React.useState(0);

    const onBlurHandleScore = (e) => {
        switch (e.target.name) {
          case "userscore1" : setScore1(Number(e.target.value));
            break;
          case "userscore2" : setScore2(Number(e.target.value));
          default: console.log("default")
        }
    }

    React.useEffect( () => {
      if(score1 && score2) {
        let winner = score1 > score2 ? props.usernames[0] : score2 > score1 ? props.usernames[1] : null;
        props.parentCallback(winner,props.roundLevel,props.indexGroupPlayer)
        if(score1 > score2)
        setWinnerParty(1)
        else if(score2 > score1) setWinnerParty(2)
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
        setScore1(null)
        setScore2(null)
      }
    }
    /*
    const onChangeHandle = (e) => {
        setUsername(prevState => e.target.value)
    };
    */
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
      {
        props.usernames.map( (joueur,i) => <Player score={ i == 0 ? score1 : i == 1 ? score2 : null} winner={winnerParty} key={i} joueur={joueur} onBlurHandleScore={onBlurHandleScore} item={i+1} /> )
      }
      </div>
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
    });

    const stateBrackets = React.useRef();

    let numberPlayers = brackets.round1.flat().length

    stateBrackets.current = brackets;

      const shufflePlayers = (list) => {
      list.sort( (a, b) => 0.5 - Math.random());
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
        fetch("../players-list-avatar.php")
        .then(response => response.json() )
        .then(data =>
          {
            if ( data.length !== 0 && data.length == 8)
            setBrackets( {...brackets,"round1": shufflePlayers(data) } )
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
        roundList[indexGroup][indexPlayer] = nameWinner
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

    const defaultStyle = {
      transition: `opacity 300ms ease-in-out`,
      opacity: 0
    }

    const transitionStyles = {
      entering: { opacity: 0 },
      entered:  { opacity: 1 },
      exiting:  { opacity: 1 },
      exited:  { opacity: 0 },
    };

return(
    <div className="main">
    { hasError  ?
      <MessageBox handleClick={handleClick}>
      {hasError}
      </MessageBox>
      : "" }

     <div className="battle-wrapper">
      <div className="battle-inner">
        <h3>Quart</h3>
         <div className="battle-list">
        {
            brackets.round1.map( (players,i) =>
            <DuoPlayer parentCallback={callbackPlayer} usernames={players} key={i} roundLevel={"round2"} indexGroupPlayer={i} />
          )
        }
       </div>
      </div>

      <div className="battle-inner">
        <h3>Demi</h3>
        <div className="battle-list-1">
         {
            brackets.round2.map( (players,i) =>
            <CSSTransition appear in={brackets.round2[i].length > 1} timeout={500} classNames="fade-answers" key={i}>
            <DuoPlayer parentCallback={callbackPlayer} usernames={ players } roundLevel={"round3"} indexGroupPlayer={i} key={i} />
            </CSSTransition>
         )
        }
         </div>
        </div>

        <div className="battle-inner">
         <h3>Final</h3>
         <div className="battle-list-2">
        {
             brackets.round3.map( (players,i) =>
             <CSSTransition appear in={brackets.round3[i].length > 1} timeout={500} classNames="fade-answers" key={i}>
             <DuoPlayer parentCallback={callbackPlayer} usernames={ players } roundLevel={"final"} indexGroupPlayer={i} />
             </CSSTransition>
             )
         }
        </div>
      </div>
     </div>
     <Transition in={brackets.final[0][0]} timeout={400}>
     {state => (
       <div style={{
         ...defaultStyle,
         ...transitionStyles[state]
       }}>
       <RegisterBracket brackets={brackets} />
       </div>
     )}
   </Transition>
    </div>
)
}

export default Tournament
