import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

export default class Handle extends React.Component {
  state = {
    clickFocused: false,
  }

  componentDidMount() {
    // mouseup won't trigger if mouse moved out of handle,
    // so we listen on document here.
    this.onMouseUpListener = addEventListener(document, 'mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    if (this.onMouseUpListener) {
      this.onMouseUpListener.remove();
    }
  }

  setHandleRef = (node) => {
    this.handle = node;
  };

  setClickFocus(focused) {
    this.setState({ clickFocused: focused });
  }

  handleMouseUp = () => {
    if (document.activeElement === this.handle) {
      this.setClickFocus(true);
    }
  }

  handleFocus = () => {
    const { index, onHandleFocus } = this.props;
    if (onHandleFocus) {
      onHandleFocus(index);
    }
  };

  handleMouseDown = () => {
    // fix https://github.com/ant-design/ant-design/issues/15324
    this.focus();
  }

  handleBlur = () => {
    this.setClickFocus(false);
  }

  handleKeyDown = () => {
    this.setClickFocus(false);
  }

  clickFocus() {
    this.setClickFocus(true);
    this.focus();
  }

  focus() {
    this.handle.focus();
  }

  blur() {
    this.handle.blur();
  }

  render() {
    const {
      index, activeIndex, prefixCls, vertical, offset, style, disabled, min, max, value, tabIndex, onHandleFocus, ...restProps
    } = this.props;

    const className = classNames(
      this.props.className,
      {
        [`${prefixCls}-handle-click-focused`]: this.state.clickFocused,
      }
    );

    const postionStyle = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` };
    const elStyle = {
      ...style,
      ...postionStyle,
    };

    let _tabIndex = tabIndex || 0;
    if (disabled || tabIndex === null) {
      _tabIndex = null;
    }

    return (
      <div
        ref={this.setHandleRef}
        tabIndex= {_tabIndex}
        {...restProps}
        className={classNames(
          className,
          {'active-handle': index === activeIndex}
        )}
        style={elStyle}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onMouseDown={this.handleMouseDown}

        // aria attribute
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={!!disabled}
      />
    );
  }
}

Handle.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  vertical: PropTypes.bool,
  offset: PropTypes.number,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  tabIndex: PropTypes.number,
};
