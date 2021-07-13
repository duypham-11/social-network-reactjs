import React from "react"
import {
    EmailShareButton,
    FacebookShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    RedditIcon,
    TelegramIcon,
    TwitterIcon,
    WhatsappIcon
  } from "react-share";


const ShareModal = ({url}) => {

    return (
        <div className="d-flex justify-content-between p-4 bg-light">
           <FacebookShareButton url={url}>
               <FacebookIcon round={true} size={32}/>
           </FacebookShareButton>

           <TwitterShareButton url={url}>
               <TwitterIcon round={true} size={32}/>
           </TwitterShareButton>

           <EmailShareButton url={url}>
               <EmailIcon round={true} size={32}/>
           </EmailShareButton>

           <RedditShareButton url={url}>
               <RedditIcon round={true} size={32}/>
           </RedditShareButton>

           <TelegramShareButton url={url}>
               <TelegramIcon round={true} size={32}/>
           </TelegramShareButton>

           <WhatsappShareButton url={url}>
               <WhatsappIcon round={true} size={32}/>
           </WhatsappShareButton>
        </div>
    )
}

export default ShareModal