package org.cswteams.ms3.dto;

import lombok.Data;
import org.cswteams.ms3.enums.AttoreEnum;
import org.cswteams.ms3.enums.RuoloEnum;

import java.time.LocalDate;

@Data
public class RegistrazioneDTO {

    private String nome;
    private String cognome;
    private LocalDate dataNascita;
    private String codiceFiscale;
    private RuoloEnum ruoloEnum;
    private String email;
    private String password;
    private AttoreEnum attoreEnum;

    public RegistrazioneDTO(){}

    public RegistrazioneDTO(String nome, String cognome, LocalDate dataNascita, String codiceFiscale, RuoloEnum ruoloEnum, String email, String password, AttoreEnum attoreEnum) {
        this.nome = nome;
        this.cognome = cognome;
        this.dataNascita = dataNascita;
        this.codiceFiscale = codiceFiscale;
        this.ruoloEnum = ruoloEnum;
        this.email = email;
        this.password = password;
        this.attoreEnum = attoreEnum;
    }
}
