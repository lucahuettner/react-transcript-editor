import React from 'react';
import PropTypes from 'prop-types';

const ExportFormatSelect = props => {
  return <select className={ props.className } name={ props.name } value={ props.value } onChange={ props.handleChange }>
    <option value="vtt">VTT - Captions</option>
    <option value="draftjs">Draft Js</option>
    <option value="txt">Text file</option>
    <option value="txtspeakertimecodes">Text file - with Speakers and Timecodes</option>
    <option value="html" disabled>HTML</option>
    <option value="word" disabled>MS Word</option>
    <option value="digitalpaperedit">Digital Paper Edit</option>
    <option value="srt">Srt - Captions</option>
    <option value="ttml">TTML - Captions</option>
    <option value="premiereTTML">TTML for Adobe Premiere - Captions</option>
    <option value="itt">iTT - Captions</option>
    <option value="csv">CSV - Captions</option>
    <option value="pre-segment-txt">Pre-segment-txt - Captions</option>
    <option value="docx">MS Word</option>
    <option value="json-captions">Json - Captions</option>
  </select>;
};

ExportFormatSelect.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func
};

export default ExportFormatSelect;
