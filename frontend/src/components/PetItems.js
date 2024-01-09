

export function PetItems({ pet, adoptPet,inProgress, disabled }) {
    return(
        <div className="item">
            <div className="image">
                <img
                src={pet.picture}
                alt=""
                ></img>
            </div>
            <div className="info-holder">
                <div>
                <b>Name:</b> {pet.name}
                </div>
                <div>
                <b>Age:</b> {pet.age}
                </div>
                <div>
                <b>Breed:</b> {pet.breed}
                </div>
                <div>
                <b>Location:</b> {pet.location}
                </div>
                <div>
                <b>Description:</b> {pet.description}
                </div>
            </div>
            <div className="action-menu">
                {   !disabled ?
                    <button 
                        onClick={adoptPet}
                        disabled={inProgress}
                        className="action-button">
                            { inProgress ? "Processing" : "Adopt"}
                    </button> :
                    <button 
                    onClick={adoptPet}
                    disabled={true}
                    className="action-button">
                        Adopted
                </button>
                }
            </div>
        </div>
    )
}