import React from 'react';

// Create a ES6 className component
    function PairOfPlayers(props) {
        const [username1, setUsername1] = React.useState("");
        const [score1, setScore1] = React.useState(0);
        const [username2, setUsername2] = React.useState("");
        const [score2, setScore2] = React.useState(0);
        const [listPlayers, setListPlayers] = React.useState(["marc","elodie","denis"]);
        const refList = React.useRef();
        const refList2 = React.useRef();

        React.useEffect( () => {
          fetch("../players-list.php")
          .then(response => response.json() )
          .then(data => setListPlayers(data) )
          .catch(e => console.error('Error:' + e));
          },[]
          );

          // chargement de la liste de joueurs depuis une API


        let classNameScore = "battle-player battle-player";

        const onChangeHandle1 = (e) => {
            setUsername1(prevState => e.target.value)
        };

        const onBlurHandleScore1 = (e) => {
            if (parseInt(e.target.value))
            setScore1(prevState => Number(e.target.value) )
            else e.target.style = "border: 2px solid red;"
        };

        const onChangeHandle2 = (e) => {
            setUsername2(prevState => e.target.value)
        };

        const onBlurHandleScore2 = (e) => {
            if (parseInt(e.target.value))
            setScore2(prevState => Number(e.target.value) )
            else e.target.style = "border: 2px solid red;"
        };

        const onFocusHandle1 = () =>  {
          refList.current.style.display = "block";
        }

        const onFocusHandle2 = () =>  {
          refList2.current.style.display = "block";
        }

        const onClickListItem1 = (e) => setUsername1(e.target.textContent)
        const onClickListItem2 = (e) => setUsername2(e.target.textContent)

        return <div className="battle">
            <div className={ !score1 ? classNameScore : score1 > score2 ? classNameScore  + "-win" : classNameScore + "-loose" }>
                  <div className="user-name">
                  { username1 ?
                  <h2 onDoubleClick={ () => setUsername1("") }>{username1}</h2>
                  : <div><label>Name : </label>
                  <input type="text" name="username1" placeholder="Your name" onBlur={onChangeHandle1} onFocus={onFocusHandle1} />
                    <div className="listNames" ref={refList}>
                    {listPlayers.map( elt => <a href="#" onClick={onClickListItem1}>{elt}</a>)}
                    </div>
                  </div>
                  }
                  </div>
            <div className="score"> { score1 ?
                <h3>{score1}</h3>
                : <div><label>Scoring : </label>
                <input type="number" name="userscore1" placeholder="Your score" onBlur={onBlurHandleScore1} /></div>
                }
            </div>
            </div>
            <div className={ !score2 ? classNameScore : score2 > score1 ? classNameScore  + "-win" : classNameScore + "-loose" }>
                <div  className="user-name">
                { username2 ?
                <h2 onDoubleClick={ () => setUsername2("") }>{username2}</h2>
                : <div><label>Name : </label>
                <input type="text" name="username2" placeholder="Enter your name" onBlur={onChangeHandle2} onFocus={onFocusHandle2} />
                  <div className="listNames" ref={refList2}>
                  {listPlayers.map( elt => <a href="#" onClick={onClickListItem2}>{elt}</a>)}
                  </div>
                </div>
            }
            </div>
            <div className="score"> { score2 ?
                <h3>{score2}</h3>
                : <div><label>Scoring : </label>
                <input type="number" name="userscore2" placeholder="Enter the score" onBlur={onBlurHandleScore2} /></div>
                }
            </div>
          </div>
        </div>;
    }

function Tournament(){
  return(
    <div className="battle-wrapper">
      <div className="battle-list">
        <PairOfPlayers level={1} />
        <PairOfPlayers level={1} />
        <PairOfPlayers level={1} />
        <PairOfPlayers level={1} />
    </div>
    <div className="battle-list-1">
        <PairOfPlayers level={2} />
        <PairOfPlayers level={2} />
    </div>
    <div className="battle-list-2">
        <PairOfPlayers level={3} />
    </div>
  </div>
  )
}

export default Tournament
