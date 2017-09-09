import React from 'react';

const ForwardBackPage = props => {
  return(

      <div 
      style={{
        marginTop: 20,
          marginLeft: "auto",
          marginRight: "auto",
          width: 80
      }}
      >
      <div
      style={{
        display: "flex",
          jusitfyContent: "center"
      }}
      >
      <img src="img/backward.svg" 
      alt="Previous datasets"
      width="30px"
      height="60px"
      onClick={props.onPrevPage}
      className={"navigation-button"}
      />
      { !props.processing ?
        <div
        style={{
          minWidth: 60,
            height: 60
        }}
        />
        :
        <img src="img/spinner.gif" 
        alt="Loading..."
        width="60px"
        height="60px"
        />
      }

      <img src="img/forward.svg" 
      alt="Next datasets"
      width="30px"
      height="60px"
      onClick={props.onNextPage}
      className={"navigation-button"}
      />
      </div>
      </div>
  )
}

export default ForwardBackPage;
