import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import './App.css';

export function ExpandableCard({ title, children, initialDisplay, expandMode, scrollable = false }) {
    const expandButton = useRef(null);
    const expandText = useRef(null);
    const expandSection = useRef(null);
    const content = useRef(null);
    const contentMode = useRef(null)
    const [expand, setExpand] = useState(false);
    const [expandDisplay, setExpandDisplay] = useState(initialDisplay);
    const [buttonIcon, setButtonIcon] = useState(null);

    useLayoutEffect(() => {

        //Absolute mode allows for overlays such as for filters over other elements. Static is for expandable sections
        //such as card for content like charts
        if(expandMode == 'absolute' || expandMode == 'static')
        {
            contentMode.current = expandMode;
        }
        //Default mode is absolute
        else
        {
            contentMode.current = 'static';
            
        }
        if(initialDisplay == true)
        {
            setButtonIcon(<MdExpandMore/>);
        }
        else
        {
            content.current.style.display = 'none';
            setButtonIcon(<MdExpandLess/>);
        }

    }, []);

    useEffect(() => {
        //Make sure title, button, and the overall title card is clickable to cause expand
        if(expandButton.current && expandText.current && expandSection.current)
        {
            expandButton.current.addEventListener('click', () => {setExpand(true)});
            //expandText.current.addEventListener('click', () => {setExpand(true)});
            //expandSection.current.addEventListener('click', () => {setExpand(true)});
        }
    }, []);

    

    useEffect(() => {
        console.log(expand)
        if(expand)
        {
            if(expandDisplay)
            {
                content.current.style.display = 'none';
                setButtonIcon(<MdExpandLess/>);
                setExpandDisplay(false);
            }
            else
            {
                content.current.style.display = 'block';
                setExpandDisplay(true);
                setButtonIcon(<MdExpandMore/>);
            }
            setExpand(false); 
        }
    }, [expand]);
    
    return (<>
        <div className="expandTitle">
            <div ref={expandSection} className="expandRow">
                <button ref={expandButton}>{buttonIcon}</button>
                <h3  ref={expandText}>{title}</h3>
            </div>
            <div
            ref={content}
            className={'cardContent'}
            style={scrollable ? {
                maxHeight: '300px',
                overflowY: 'scroll',
                paddingBottom: '200px',
                boxSizing: 'border-box'
            } : {}}
            >
                {children}
            </div>
        </div >
    </>);
}