

export function WalletNotDetected() {
    return(
        <div className="container">
            Wallet not detected. Please install{` `}
            <a target="_blank" rel="noreferrer" className="link" href="https://metamask.io/download/">
                Metmask
            </a>
        </div>
    )
}